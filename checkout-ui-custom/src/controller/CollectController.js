import { PickupComplementField } from '../templates';
import InputError from '../templates/InputError';
import { AD_TYPE, ERRORS, STEPS, TIMEOUT_750 } from '../utils/const';
import { preparePhoneField, validatePhoneNumber } from '../utils/phoneFields';

const CollectController = (() => {
  const state = {
    inCollect: false,
    pickupSelected: false,
    validForm: false,
    errorFields: []
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

  const checkField = (field) => {
    let isValid = true;
    let parent;
    let error = ERRORS.DEFAULT;

    switch (field) {
      // Customer name
      case 'pickup-receiver':
        isValid = !($(`#${field}`).length > 0 && !$(`#${field}`).attr('disabled') && !$(`#${field}`).val());
        parent = '.shp-pickup-receiver';
        break;
      // Customer phone number
      case 'custom-pickup-complement':
        isValid = validatePhoneNumber($(`#${field}`).val());
        parent = '#box-pickup-complement';
        error = ERRORS.PHONE;
        break;
      default:
        isValid = $(`#${field}`).val().trim() !== '';
        break;
    }

    if (!isValid) {
      $(parent).addClass('error');
      $(parent).append(InputError(error));
      $(`${parent} span.error`).show();
      state.validForm = false;
      state.errorFields.push(field);
    } else {
      $(parent).removeClass('error');
    }
  };

  const checkFields = (fields) => {
    fields.forEach((field) => {
      checkField(field);
    });
  };

  // Validate Collection Form Fields
  const checkForm = () => {
    console.info('Check Collect Form');
    $('span.help.error')?.remove();
    state.validForm = true;
    state.errorFields = [];

    checkFields(['pickup-receiver', 'custom-pickup-complement']);

    if (state.errorFields.length > 0 && document.getElementById(state.errorFields[0])) {
      document.getElementById(state.errorFields[0]).focus();
    }
  };

  const saveCollectFields = () => {
    checkForm();

    if (state.validForm) {
      const phoneNumber = $('#custom-pickup-complement').val();

      localStorage.setItem('saving-shipping-collect', true);
      $('#btn-go-to-payment').trigger('click');

      setTimeout(() => {
        window.vtexjs.checkout
          .getOrderForm()
          .then((orderForm) => {
            const { address } = orderForm.shippingData;
            address.complement = phoneNumber;

            return window.vtexjs.checkout.calculateShipping(address);
          })
          .done(() => {
            localStorage.removeItem('saving-shipping-collect');
          });
      }, TIMEOUT_750);
    }
  };

  const addCustomPhoneInput = () => {
    const customPhoneInput = document.getElementById('custom-pickup-complement');
    if (customPhoneInput) return;

    $('.btn-go-to-payment-wrapper').before(PickupComplementField);
    const newPhoneInput = document.getElementById('custom-pickup-complement');
    const profile = window.vtexjs.checkout.orderForm?.clientProfileData;
    if (profile && newPhoneInput) {
      const { phone } = profile;
      newPhoneInput.value = phone;
    }
    preparePhoneField('#custom-pickup-complement');
  };

  //! TODO: al merger a develop podemos refactorizar esta función llevándola a utils
  //! TODO: by merging to develop we can refactor this function by taking it to utils
  const addCustomBtnPayment = () => {
    if ($('#custom-go-to-payment').length > 0) return;

    const nativePaymentBtn = $('#btn-go-to-payment');
    const customPaymentBtn = nativePaymentBtn.clone(false);

    $(nativePaymentBtn).hide();
    $(customPaymentBtn).data('bind', '');
    $(customPaymentBtn).removeAttr('id').attr('id', 'custom-go-to-payment');
    $(customPaymentBtn).removeAttr('data-bind');
    $(customPaymentBtn).css('display', 'block');

    $('p.btn-go-to-payment-wrapper').append(customPaymentBtn);

    $(customPaymentBtn).on('click', saveCollectFields);
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
      }

      /* If it has been redirected because of missing values, the click is forced to show the errors */
      if (localStorage.getItem('shipping-incomplete-values')) {
        $('#custom-go-to-payment').trigger('click');
        localStorage.removeItem('shipping-incomplete-values');
      }
    } else {
      /* Remove box-pickup-complement so that the input does not appear in the other steps of the checkout process  */
      $('#box-pickup-complement')?.remove();

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
    state
  };
})();

export default CollectController;
