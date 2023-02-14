/* eslint-disable func-names */
import { InputError } from '../partials';
import { RICA_APP, STEPS, TIMEOUT_750, TV_APP } from '../utils/const';
import { checkoutSendCustomData, isValidNumberBash, saveAddress, setRicaFields } from '../utils/functions';
import ViewController from './ViewController';

const FormController = (() => {
  const state = {
    validForm: true,
    runningObserver: false,
  };

  const checkField = (field) => {
    if ($(`#${field}`).length > 0 && !$(`#${field}`).attr('disabled') && !$(`#${field}`).val()) {
      $(`.${field}`).addClass('error');
      $(`.${field}`).append(InputError);
      $(`.${field} span.error`).show();
      state.validForm = false;
    } else {
      $(`.${field}`).removeClass('error');
    }
  };

  const checkFields = (fields) => {
    fields.forEach((field) => {
      checkField(field);
    });
  };

  const checkRICAForm = () => {
    const ricaFields = [
      'tfg-rica-id-passport',
      'tfg-rica-fullname',
      'tfg-rica-street',
      'tfg-rica-suburb',
      'tfg-rica-city',
      'tfg-rica-postal-code',
      'tfg-rica-province',
    ];

    checkFields(ricaFields);
  };

  const checkForm = () => {
    // Reset state & clear errors
    $('span.help.error').remove();
    state.validForm = true;

    /* Checking Receiver & Receiver Phone */
    if ($('div.address-list.vtex-omnishipping-1-x-addressList').length <= 0) {
      checkField('ship-receiverName');

      if (!isValidNumberBash(document.querySelector('.vtex-omnishipping-1-x-address input#ship-complement').value)) {
        $('.vtex-omnishipping-1-x-address .ship-complement').addClass('error');
        $('.vtex-omnishipping-1-x-address .ship-complement').append(InputError());
        $('.vtex-omnishipping-1-x-address .ship-complement span.error').show();
        state.validForm = false;
      } else {
        $('.vtex-omnishipping-1-x-address .ship-complement').removeClass('error');
      }
    }

    /* Checking Custom Fields */
    if (ViewController.state.showRICAForm) {
      checkRICAForm();
    }
    if (ViewController.state.showTVIDForm) {
      checkField('tfg-tv-licence');
    }
  };

  const getRICAFields = () => {
    const ricaFields = {};

    ricaFields.idOrPassport = $('#tfg-rica-id-passport').val();
    ricaFields.sameAddress = $('#tfg-rica-same-address').is(':checked');
    ricaFields.fullName = $('#tfg-rica-fullname').val();
    ricaFields.streetAddress = $('#tfg-rica-street').val();
    ricaFields.suburb = $('#tfg-rica-suburb').val();
    ricaFields.city = $('#tfg-rica-city').val();
    ricaFields.postalCode = $('#tfg-rica-postal-code').val();
    ricaFields.province = $('#tfg-rica-province').val();
    ricaFields.country = $('#tfg-rica-country').val();

    return ricaFields;
  };

  const saveAddressType = () => {
    const addressType = localStorage.getItem('addressType');
    window.vtexjs.checkout.getOrderForm().then((orderForm) => {
      const { shippingData } = orderForm;
      shippingData.selectedAddresses[0].addressType = addressType;
      return window.vtexjs.checkout.sendAttachment('shippingData', shippingData);
    });
  };

  const getTVFormFields = () => ({ tvID: $('#tfg-tv-licence').val() });

  const saveShippingForm = () => {
    const { showRICAForm, showTVIDForm } = ViewController.state;

    checkForm();

    if (state.validForm) {
      // Fields saved in orderForm
      if (showRICAForm) {
        const ricaFields = getRICAFields();
        checkoutSendCustomData(RICA_APP, ricaFields);
      }

      // Fields saved in Masterdata
      const masterdataFields = {};

      if (showTVIDForm) {
        const tvFields = getTVFormFields();
        checkoutSendCustomData(TV_APP, tvFields);
        Object.assign(masterdataFields, tvFields);
      }

      saveAddress(masterdataFields);

      setTimeout(() => {
        $('#btn-go-to-payment').trigger('click');
        saveAddressType();
      }, TIMEOUT_750);
    }
  };

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

      $(customPaymentBtn).on('click', saveShippingForm);
    }
  };

  const runCustomization = () => {
    // If user has no addresses, and has Deliver selected.

    if (
      $('div.address-list').length < 1 &&
      $('#shipping-option-delivery').hasClass('shp-method-option-active') &&
      $('body').data('delivery-view') !== 'address-list'
    ) {
      $('body:not(.has-no-addresses)').addClass('has-no-addresses');
    } else {
      $('body.has-no-addresses').removeClass('has-no-addresses');
    }

    if (window.location.hash === STEPS.SHIPPING) {
      if ($('.shipping-summary-info').length && $('.shipping-summary-info').text() === 'Waiting for more information') {
        window.location.hash = STEPS.PROFILE;
        return;
      }

      setTimeout(() => {
        const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');
        if (selectedDelivery) {
          addCustomBtnPayment();
        }

        // eslint-disable-next-line no-use-before-define
        runFormObserver();
      }, TIMEOUT_750);
    }
  };

  // INPUT EVENT SUBSCRIPTION
  const runFormObserver = () => {
    if (state.runningObserver) return;

    const elementToObserveChange = document.querySelector('.shipping-container .box-step');
    const observerConfig = { attributes: false, childList: true, characterData: false };
    const observer = new MutationObserver(() => {
      state.runningObserver = true;
      if (window.location.hash === STEPS.SHIPPING && !$('btn-link vtex-omnishipping-1-x-btnDelivery').length) {
        runCustomization();
      }
    });

    if (elementToObserveChange) {
      observer.observe(elementToObserveChange, observerConfig);
    }
  };

  $(document).on('change', '.vtex-omnishipping-1-x-deliveryGroup #tfg-delivery-floor', function () {
    if ($(this).val() === 'Ground') {
      $('#tfg-lift-stairs').val('');
      $('#tfg-lift-stairs').attr('disabled', 'disabled');
      $('#tfg-lift-stairs').next('span.help.error').remove();
      $('.tfg-lift-stairs').removeClass('error');
    } else {
      $('#tfg-lift-stairs').removeAttr('disabled');
    }
  });

  $(document).on(
    'change',
    '.vtex-omnishipping-1-x-deliveryGroup .tfg-custom-selector, .vtex-omnishipping-1-x-deliveryGroup .tfg-input',
    function () {
      if ($(this).val()) {
        $(this).parent().removeClass('error');
        $(this).next('span.help.error').remove();
        $(this).addClass('tfg-input-completed');
      } else {
        $(this).removeClass('tfg-input-completed');
      }
    }
  );

  $(document).on('change keyup', '.vtex-omnishipping-1-x-addressForm input, #tfg-tv-licence', function () {
    if ($(this).val()) {
      $(this).parent().removeClass('error');
      $(this).next('span.help.error').remove();
    }
  });

  $(document).on('change', '.vtex-omnishipping-1-x-deliveryGroup #tfg-rica-same-address', function () {
    if ($(this).is(':checked')) {
      setRicaFields('shippingAddress');
    } else {
      $('.rica-field').val('');
    }
  });

  $(document).on('click', '#shipping-data .btn-link.vtex-omnishipping-1-x-btnDelivery', () => {
    runCustomization();
  });

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

export default FormController;
