import { InputError, PickupComplementField } from '../templates';
import { AD_TYPE, STEPS, TIMEOUT_750 } from '../utils/const';
import { isValidNumberBash } from '../utils/functions';

const CollectController = (() => {
  const state = {
    inCollect: false,
    pickupSelected: false,
    validForm: false,
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

  const bindingEvents = () => {
    // eslint-disable-next-line func-names
    $(document).on('keyup', 'div.shipping-container #custom-pickup-complement', function () {
      /* Forzamos el cambio del valor de placeholder para que no marque undefined */
      if (!$(this).val()) {
        $(this).attr('placeholder', '');
      }
    });
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
    // Reset state & clear errors
    $('span.help.error').remove();
    state.validForm = true;

    checkFields(['pickup-receiver', 'custom-pickup-complement']);
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

      setTimeout(() => {
        window.vtexjs.checkout
          .getOrderForm()
          .then((orderForm) => {
            const { address } = orderForm.shippingData;
            address.complement = collectPhone;

            return window.vtexjs.checkout.calculateShipping(address);
          })
          .done(() => {
            localStorage.removeItem('saving-shipping-collect');
          });
      }, TIMEOUT_750);
    }
  };

  //! TODO: al merger a develop podemos refactorizar esta función llevándola a utils
  const setInputPhone = () => {
    const phoneInput = document.querySelector('input#custom-pickup-complement');

    if (phoneInput) {
      phoneInput.setAttribute('placeholder', '');
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
    } else {
      if ($('input#custom-pickup-complement').val() === '') {
        $('input#custom-pickup-complement').val(phoneNumber);

        window.vtexjs.checkout.getOrderForm().then(function (orderForm) {
          const { shippingData } = orderForm;
          shippingData.address.complement = phoneNumber;
          return vtexjs.checkout.sendAttachment('shippingData', shippingData);
        });
      }
    }
    prePopulateReceiverName();
  };

  const prePopulateReceiverName = () => {
    const { firstName, lastName } = window.vtexjs.checkout.orderForm?.clientProfileData;
    const firstNameInput = $('#client-first-name').val();
    const lastNameInput = $('#client-last-name').val();

    const receiverName = firstName ? [firstName, lastName].join(' ') : [firstNameInput, lastNameInput].join(' ');

    if ($('input#pickup-receiver').val() === '') {
      $('input#pickup-receiver').val(receiverName.trim());

      window.vtexjs.checkout.getOrderForm().then(function (orderForm) {
        const { shippingData } = orderForm;
        shippingData.address.receiverName = receiverName.trim();
        return vtexjs.checkout.sendAttachment('shippingData', shippingData);
      });
    }
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

  const toggleCollectionGoogleInput = () => {
    if ($('#pkpmodal-search > .pac-target-input:not(.localizedGoogle)').length > 0) {
      window.google.maps.event.clearInstanceListeners(document.querySelector('#pkpmodal-search > .pac-target-input'));
      const options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'za' },
      };
      // eslint-disable-next-line no-new
      new window.google.maps.places.Autocomplete(
        document.querySelector('#pkpmodal-search > .pac-target-input'),
        options
      );
      $('#pkpmodal-search > .pac-target-input').addClass('localizedGoogle');
    }
  };

  const runCustomization = () => {
    const shippingLoaded = $('div#postalCode-finished-loading').length > 0;

    if (window.location.hash === STEPS.SHIPPING && shippingLoaded) {
      state.inCollect = $('#shipping-option-pickup-in-point').hasClass('shp-method-option-active');
      state.pickupSelected = $('div.ask-for-geolocation').length === 0;

      if (state.inCollect) {
        if (state.pickupSelected) {
          $('button.shp-pickup-receiver__btn').trigger('click');
          $('div.shp-pickup-receiver').addClass('show');

          addCustomPhoneInput();
          addCustomBtnPayment();
        } else {
          $('div.shp-pickup-receiver').removeClass('show');
        }

        changeTranslations();
        bindingEvents();
        toggleCollectionGoogleInput();
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
    const elementToObserveChange = document.querySelector('.shipping-container .box-step');
    const observerConfig = { attributes: false, childList: true, characterData: false };
    const observer = new MutationObserver(() => {
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

  const publicInit = () => {};

  return {
    init: publicInit,
    state,
  };
})();

export default CollectController;
