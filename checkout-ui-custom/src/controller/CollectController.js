import { InputError, PickupComplementField } from '../partials';
import { setPickupLoading } from '../partials/Deliver/utils';
import { AD_TYPE, GEOLOCATE, MANUAL, NONE, PICKUP, PICKUP_APP, STEPS } from '../utils/const';
import { clearLoaders, getSpecialCategories, isValidNumberBash } from '../utils/functions';
import { sendOrderFormCustomData } from '../utils/services';

const CollectController = (() => {
  const state = {
    inCollect: false,
    pickupSelected: false,
    validForm: false,
    runningObserver: false,
    collectReset: false,
  };

  const changeTranslations = () => {
    $('p.vtex-omnishipping-1-x-shippingSectionTitle').text('Collect options');
    $('#change-pickup-button').text('Available pickup points');
    $('h2.vtex-omnishipping-1-x-geolocationTitle.ask-for-geolocation-title').text('Find nearby Click & Collect points');
    $('h3.vtex-omnishipping-1-x-subtitle.ask-for-geolocation-subtitle').text(
      "Search for addresses that you frequently use and we'll locate stores nearby."
    );

    if (state.pickupSelected) {
      $('label.shp-pickup-receiver__label').text("Recipient's name");
    }
  };

  const resetPickup = () => {
    $('.delivery-group-content').empty();
    $('.btn-go-to-payment-wrapper').empty();
    $(
      '<div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" stroke="#FCFCFC" fill="#FCFCFC"/><path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" stroke="#000" fill="#000"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg><div>'
    )
      .css({ display: 'flex', 'justify-content': 'center', 'align-items': 'center', 'min-height': '100px' })
      .appendTo('.delivery-group-content');
    const { orderForm } = window.vtexjs.checkout;
    const { shippingData } = orderForm;
    const retShipping = {
      ...shippingData,
      address: null,
      availableAddresses: shippingData.availableAddresses,
      selectedAddresses: shippingData.selectedAddresses.filter((add) => add.addressType !== 'search'),
      logisticsInfo: shippingData.logisticsInfo,
    };
    window.vtexjs.checkout.sendAttachment('shippingData', retShipping);
    setPickupLoading();
  };

  const pickupMap = () => {
    // Pickup Point Map
    $('.pickup-marker-blue').remove();
    if ($('#change-pickup-button').length) {
      $(
        '<button class="vtex-omnishipping-1-x-pickupPointSeeMore button-see-pickup-point btn btn-link" id="tfg-pickup-see-more-button" type="button">Collect Point Details</button>'
      ).appendTo('.vtex-omnishipping-1-x-PickupPoint');
      $(
        '<button class="vtex-change-pickup button-change-pickup-point" id="tfg-pickup-button" type="button">Change</button>'
      ).appendTo('.vtex-omnishipping-1-x-PickupPoint');
      $('#change-pickup-button').remove();
      $('#details-pickup-button').remove();
    }

    if ($('.vtex-omnishipping-1-x-ask').length) {
      $('.vtex-omnishipping-1-x-ask').empty();
      $(`<div class="pickup-map-container">
          <div class="pickup-map-icon">
            <svg class="icon-map" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="24" fill="#2424E4"/>
              <path d="M24.2147 11C21.5065 11.0031 18.9102 12.0802 16.9952 13.9952C15.0802 15.9102 14.0031 18.5065 14 21.2147C14 29.9552 23.2861 36.5599 23.6807 36.8385C23.8389 36.9438 24.0247 37 24.2147 37C24.4047 37 24.5905 36.9438 24.7486 36.8385C25.1433 36.5599 34.4294 29.9552 34.4294 21.2147C34.4263 18.5065 33.3491 15.9102 31.4342 13.9952C29.5192 12.0802 26.9228 11.0031 24.2147 11ZM24.2147 17.5003C24.9493 17.5003 25.6675 17.7181 26.2783 18.1262C26.8891 18.5344 27.3652 19.1145 27.6464 19.7932C27.9275 20.472 28.0011 21.2188 27.8577 21.9393C27.7144 22.6599 27.3607 23.3217 26.8412 23.8412C26.3217 24.3607 25.6599 24.7144 24.9393 24.8577C24.2188 25.0011 23.472 24.9275 22.7932 24.6464C22.1145 24.3652 21.5344 23.8891 21.1262 23.2783C20.7181 22.6675 20.5003 21.9493 20.5003 21.2147C20.5003 20.2296 20.8916 19.2848 21.5882 18.5882C22.2848 17.8916 23.2296 17.5003 24.2147 17.5003Z" fill="#FCFCFC"/>
            </svg>
            Find nearby collect points
            <div class="pickup-map-text">
              Search for addresses that you frequently use and we’ll locate stores nearby.
            </div>
          </div>
          <button class="pickup-map-geolocation" id="find-pickups-button-new" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
              <path d="M1.12954 2.34666L5.24985 14.2506C5.42563 14.7639 6.15688 14.7498 6.3186 14.2295L7.97798 8.84354C8.00302 8.75549 8.05054 8.67548 8.11588 8.61138C8.18122 8.54727 8.26213 8.50127 8.35063 8.47791L13.7295 6.81854C14.2499 6.65682 14.2639 5.92557 13.7506 5.74979L1.84672 1.62948C1.74671 1.59433 1.6388 1.58815 1.53542 1.61167C1.43205 1.63519 1.33743 1.68745 1.26247 1.76241C1.18751 1.83737 1.13525 1.93199 1.11173 2.03536C1.08822 2.13873 1.09439 2.24665 1.12954 2.34666V2.34666Z" stroke="#2424E4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Use my current location
          </button>
          <button class="pickup-map-manual" id="find-pickups-manually-search">
            Manually search for an address
          </button>
        </div>`).appendTo('.vtex-omnishipping-1-x-ask');
    }

    $('#pkpmodal-close')
      .unbind()
      .click(() => {
        $('#tfg-pickup-map').remove();
      });

    const iframeFunctions = function (state) {
      $('<div class="tfg-pickup-map" id="tfg-pickup-map"><div class="tfg-pickup-map-content"></div></div>').appendTo(
        $('body')
      );
      $('body').css('position', 'fixed');
      $('body').css('width', '100%');
      const iframe = document.createElement('iframe');
      iframe.src = 'https://pickup-map.bashconnect.com/';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.id = 'map';
      iframe.allow = 'geolocation';
      $(iframe).appendTo('.tfg-pickup-map-content');
      const connection = window.Penpal.connectToChild({
        iframe,
        methods: {
          sendAttachment: (data) => {
            setPickupLoading();
            window.vtexjs.checkout.sendAttachment('shippingData', data);
            $('#tfg-pickup-map').remove();
            $('body').css('overflow', 'auto');
            $('body').css('width', 'auto');
            $('body').css('position', 'relative');
          },
          getCheckoutJS: () => window.vtexjs.checkout.orderForm,
          getSpecialFields: () => getSpecialCategories(window.vtexjs.checkout.orderForm.items),
          remove: () => {
            $('#tfg-pickup-map').remove();
            $('body').css('overflow', 'auto');
            $('body').css('width', 'auto');
            $('body').css('position', 'relative');
          },
          getState: () => state,
        },
      });

      $('#tfg-pickup-map').click((e) => {
        e.stopPropagation();
        $('#tfg-pickup-map').remove();
        $('body').css('overflow', 'auto');
        $('body').css('width', 'auto');
        $('body').css('position', 'relative');
      });
    };

    $('#tfg-pickup-button')
      .unbind()
      .click(() => iframeFunctions(NONE));
    $('#tfg-pickup-see-more-button')
      .unbind()
      .click(() => iframeFunctions(PICKUP));
    $('#find-pickups-button-new')
      .unbind()
      .click(() => iframeFunctions(GEOLOCATE));
    $('#find-pickups-manually-search')
      .unbind()
      .click(() => iframeFunctions(MANUAL));
  };

  const checkFields = (fields) => {
    fields.forEach((field) => {
      let isValid = true;
      let parent;

      switch (field) {
        case 'pickup-receiver':
          isValid = !($(`#${field}`).length > 0 && !$(`#${field}`).attr('disabled') && !$(`#${field}`).val());
          parent = '.shp-pickup-receiver';
          break;
        case 'custom-pickup-complement':
          isValid = isValidNumberBash($(`#${field}`).val());
          parent = '#box-pickup-complement';
          break;
        default:
          break;
      }

      if (!isValid) {
        $(parent).addClass('error');
        $(parent).append(InputError());
        $(`${parent} span.error`).show();
        state.validForm = false;
      } else {
        $(parent).removeClass('error');
      }
    });
  };

  const checkForm = () => {
    $('span.help.error').remove();
    state.validForm = true;
    checkFields(['pickup-receiver', 'custom-pickup-complement']);
  };

  const updateCollectSummary = (name, number) => {
    if (!name || !number) return;
    if (!$('.vtex-omnishipping-1-x-SummaryItemAddress .collect-receiver').length) {
      $('.vtex-omnishipping-1-x-SummaryItemAddress').append(`<p class="collect-receiver">
      ${name} - ${number}
      </p>`);
      return;
    }

    $('.collect-receiver').html(`${name} - ${number} `);
  };

  const saveCollectFields = () => {
    checkForm();
    if (state.validForm) {
      let collectPhone = $('#custom-pickup-complement').val().replace(/\s/g, '');

      if (collectPhone.length === 9 && collectPhone[0] !== '0') {
        collectPhone = `0${collectPhone}`;
      }

      localStorage.setItem('saving-shipping-collect', true);
      $('#btn-go-to-payment').trigger('click');

      // setTimeout(() => {
      window.vtexjs.checkout
        .getOrderForm()
        .then((orderForm) => {
          const { address } = orderForm.shippingData;

          sendOrderFormCustomData(PICKUP_APP, { phone: collectPhone }).then(() => {
            updateCollectSummary(address.receiverName, collectPhone);
          });

          return window.vtexjs.checkout.calculateShipping(address);
        })
        .done(() => {
          localStorage.removeItem('saving-shipping-collect');
        });
      // }, TIMEOUT_750);
    }
  };

  //! TODO: al merger a develop podemos refactorizar esta función llevándola a utils
  const setInputPhone = () => {
    const phoneInput = document.querySelector('input#custom-pickup-complement');

    if (phoneInput) {
      phoneInput.setAttribute('placeholder', '');
    }
  };

  const prePopulateReceiverName = () => {
    const { firstName, lastName } = window.vtexjs.checkout.orderForm?.clientProfileData;
    const firstNameInput = $('#client-first-name').val();
    const lastNameInput = $('#client-last-name').val();

    const receiverName = firstName ? [firstName, lastName].join(' ') : [firstNameInput, lastNameInput].join(' ');

    if ($('input#pickup-receiver').val() === '') {
      $('input#pickup-receiver').val(receiverName.trim());

      window.vtexjs.checkout.getOrderForm().then((orderForm) => {
        const { shippingData } = orderForm;
        shippingData.address.receiverName = receiverName.trim();
        return window.vtexjs.checkout.sendAttachment('shippingData', shippingData);
      });
    }
  };

  const addCustomPhoneInput = () => {
    /* Set orderForm value if exists */
    const phoneNumber = window.vtexjs.checkout.orderForm?.clientProfileData?.phone ?? $('#client-phone').val() ?? '';

    if ($('input#custom-pickup-complement').length === 0) {
      $('.btn-go-to-payment-wrapper').before(PickupComplementField);
      setInputPhone();

      if (phoneNumber) {
        $('input#custom-pickup-complement').val(phoneNumber);
      }
    } else if ($('input#custom-pickup-complement').val() === '') {
      $('input#custom-pickup-complement').val(phoneNumber);
    }
    prePopulateReceiverName();
  };

  //! TODO: al merger a develop podemos refactorizar esta función llevándola a utils
  const addCustomBtnPayment = () => {
    if ($('#custom-go-to-payment').length <= 0) {
      const nativePaymentBtn = $('#btn-go-to-payment');
      const customPaymentBtn = nativePaymentBtn.clone(false);

      $(nativePaymentBtn).hide();
      $(customPaymentBtn).data('bind', '');
      $(customPaymentBtn).removeAttr('id').attr('id', 'custom-go-to-payment');
      $(customPaymentBtn).removeAttr('data-bind');
      $(customPaymentBtn).css('display', 'block');

      $('p.btn-go-to-payment-wrapper').append(customPaymentBtn);

      $(customPaymentBtn).on('click', saveCollectFields);
    }
  };

  const runCustomization = () => {
    const shippingLoaded = $('div#postalCode-finished-loading').length > 0;

    $('#shipping-option-pickup-in-point').one('click', () => {
      state.collectReset = true;
    });

    if (window.location.hash === STEPS.SHIPPING && shippingLoaded) {
      state.inCollect = $('#shipping-option-pickup-in-point').hasClass('shp-method-option-active');
      state.pickupSelected = $('div.ask-for-geolocation').length === 0;

      if (state.inCollect) {
        clearLoaders();
        pickupMap();
        if (state.pickupSelected && !state.collectReset) {
          $('button.shp-pickup-receiver__btn').trigger('click');
          $('div.shp-pickup-receiver').addClass('show');
          $('p#box-pickup-complement').addClass('show');

          addCustomPhoneInput();
          addCustomBtnPayment();
        } else {
          $('div.shp-pickup-receiver').removeClass('show');
          $('p#box-pickup-complement').removeClass('show');
        }
        if (state.collectReset) {
          resetPickup();
          state.collectReset = false;
        }

        changeTranslations();
      }

      /* If it has been redirected because of missing values, the click is forced to show the errors */
      if (localStorage.getItem('shipping-incomplete-values')) {
        $('#custom-go-to-payment').trigger('click');
        localStorage.removeItem('shipping-incomplete-values');
      }
    } else {
      /* Remove box-pickup-complement so that the input does not appear in the other steps of the checkout process  */
      $('#box-pickup-complement').remove();

      if (window.location.hash === STEPS.PAYMENT) {
        setTimeout(() => {
          const address = window.vtexjs.checkout.orderForm?.shippingData?.address;
          const savingCollect = localStorage.getItem('saving-shipping-collect');

          if (!savingCollect) {
            /* Redirect to shipping if required fields are empty */
            if (address && address.addressType === AD_TYPE.PICKUP && (!address.receiverName || !address.complement)) {
              window.location.hash = STEPS.SHIPPING;
              localStorage.setItem('shipping-incomplete-values', true);
            }
          }
        }, 1000);
      }
    }

    // eslint-disable-next-line no-use-before-define
    runCollectObserver();
  };

  /* We need this observer to detect the change in the deliver and collect buttons */
  const runCollectObserver = () => {
    if (state.runningObserver) return;

    const elementToObserveChange = document.querySelector('.shipping-container .box-step');
    const observerConfig = { attributes: false, childList: true, characterData: false };
    const observer = new MutationObserver(() => {
      state.runningObserver = true;
      runCustomization();
    });

    if (elementToObserveChange) {
      observer.observe(elementToObserveChange, observerConfig);
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  return {
    state,
    init: () => {},
  };
})();

export default CollectController;
