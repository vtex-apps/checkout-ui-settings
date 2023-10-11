// @ts-nocheck
import { InputError } from '../partials';
import { PickupPhoneField } from '../partials/AddressForm';
import PickupContainer from '../partials/Collect/PickupContainer';
import { getBestRecipient, setPickupLoading } from '../partials/Deliver/utils';
import { AD_TYPE, GEOLOCATE, MANUAL, NONE, PICKUP, PICKUP_APP, STEPS } from '../utils/const';
import { clearLoaders, getSpecialCategories, isValidNumberBash, scrollToInvalidField } from '../utils/functions';
import { getBestPhoneNumber } from '../utils/phoneFields';
import sendEvent from '../utils/sendEvent';
import { getOrderFormCustomData, sendOrderFormCustomData } from '../utils/services';

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

  // Pickup Point Map
  const pickupMap = () => {
    // Modify view to match design for a selected pickup point
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

    // Remove vtex no point selected and replace with our own html
    if ($('.vtex-omnishipping-1-x-ask').length) {
      $('.vtex-omnishipping-1-x-ask').empty();
      $(PickupContainer()).appendTo('.vtex-omnishipping-1-x-ask');
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
    pickupMap();
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
        scrollToInvalidField();
        state.validForm = false;

        window.postMessage(
          {
            type: 'COLLECTION_VALIDATION_ERROR',
            message: `${field} is invalid`,
          },
          '*'
        );
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

      try {
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
      } catch (e) {
        console.error('VTEX_ORDERFORM_ERROR: Could not load at CollectController', e);
        sendEvent({
          eventCategory: 'Checkout_SystemError',
          action: 'OrderFormFailed',
          label: 'Could not getOrderForm() from vtex',
          description: 'Could not load orderForm for Collect.',
        });
      }
    }
  };

  const prePopulateReceiverName = () => {
    if ($('#pickup-receiver').length < 1) return;

    const receiverName = getBestRecipient({
      preferred: window?.vtexjs?.checkout?.orderForm?.shippingData?.address?.receiverName,
      type: 'collect',
    }).trim();

    if (receiverName.length > 0 && $('#pickup-receiver')?.val()?.trim() === '') {
      $('#pickup-receiver').val(receiverName);
    }
  };

  const addCustomPhoneInput = () => {
    /* Set orderForm value if exists */
    const fields = getOrderFormCustomData(PICKUP);
    const phoneNumber = getBestPhoneNumber({ type: 'collect', fields });

    if ($('#custom-pickup-complement').length === 0) {
      $('.btn-go-to-payment-wrapper').before(PickupPhoneField);
    }

    if (phoneNumber) $('#custom-pickup-complement').val(phoneNumber).css('border', 0);
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
    const shippingLoaded = $('#postalCode-finished-loading').length > 0;

    $('#shipping-option-pickup-in-point').one('click', () => {
      state.collectReset = true;
    });

    prePopulateReceiverName();

    if (window.location.hash === STEPS.SHIPPING && shippingLoaded) {
      state.inCollect = $('#shipping-option-pickup-in-point').hasClass('shp-method-option-active');
      state.pickupSelected = $('div.ask-for-geolocation').length === 0;

      if (state.inCollect) {
        if (
          (!$('#tfg-pickup-button').length && !$('#tfg-pickup-see-more-button').length) ||
          (!$('#find-pickups-manually-search').length && !$('#find-pickups-button-new').length)
        ) {
          pickupMap();
        }
        clearLoaders();
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
            const { phone } = getOrderFormCustomData(PICKUP_APP);

            /* Redirect to shipping if required fields are empty */
            if (address && address.addressType === AD_TYPE.PICKUP && (!address.receiverName || !phone)) {
              window.location.hash = STEPS.SHIPPING;
              localStorage.setItem('shipping-incomplete-values', true);
              sendEvent({
                action: 'stepRedirect',
                label: 'redirectPaymentToShipping',
                description: 'User redirect to shipping because Collection is missing receiverName or phone number.',
              });
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
