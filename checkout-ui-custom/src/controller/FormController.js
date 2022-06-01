/* eslint-disable func-names */
import { STEPS, TIMEOUT_750, RICA_APP } from '../utils/const';
import {
  saveAddress,
  checkoutSendCustomData,
  setRicaFields
} from '../utils/functions';
import { InputError } from '../templates';
import ViewController from './ViewController';

const FormController = (() => {
  const state = {
    validForm: true
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

  const checkNativeForm = () => {
    const nativeFields = [
      'v-custom-ship-street',
      'ship-city',
      'ship-number',
      'custom-field-receiverName',
      'custom-field-neighborhood',
      'ship-postalCode'
    ];

    /* When the list of addresses appears,
    it does not complete ship-state correctly in the native process so,
    if it has already been reported, it is not validated. */
    const { address } = window.vtexjs.checkout.orderForm.shippingData;

    if (!address?.state) {
      nativeFields.push('ship-state');
    }

    checkFields(nativeFields);
  };

  const checkFurnitureForm = () => {
    const furnitureFields = ['tfg-building-type', 'tfg-parking-distance', 'tfg-delivery-floor', 'tfg-lift-stairs'];

    checkFields(furnitureFields);
  };

  const checkRICAForm = () => {
    const ricaFields = [
      'tfg-rica-id-passport',
      'tfg-rica-fullname',
      'tfg-rica-street',
      'tfg-rica-suburb',
      'tfg-rica-city',
      'tfg-rica-postal-code',
      'tfg-rica-province'
    ];

    checkFields(ricaFields);
  };

  const checkPhoneField = () => {
    if (!ViewController.state.intTelInput) return;
    if (typeof ViewController.state.intTelInput.isValidNumber !== 'function') return;

    const isValidNumber = ViewController.state.intTelInput.isValidNumber();
    if (!isValidNumber) {
      $('.custom-field-complement').append(InputError());
      $('.custom-field-complement span.error').show();

      state.validForm = false;
    }
  };

  const isValidAddressForm = () => {
    if (!state.validForm) {
      const addressListEditSelector = $('.vtex-omnishipping-1-x-buttonEditAddress');
      const addressItemEditSelector = $('.vtex-omnishipping-1-x-linkEdit');
      if (addressListEditSelector.length) {
        addressListEditSelector.trigger('click');
      } else {
        addressItemEditSelector.trigger('click');
      }
      return false;
    }
    return true;
  };

  const checkForms = (showFurnitureForm = false, showRICAForm = false, showTVIDForm = false) => {
    // Reset state & clear errors
    $('span.help.error').remove();
    state.validForm = true;

    checkNativeForm();
    checkPhoneField();
    if (!isValidAddressForm()) return;

    if (showFurnitureForm) {
      checkFurnitureForm();
    }

    if (showRICAForm) {
      checkRICAForm();
    }

    if (showTVIDForm) {
      checkField('tfg-tv-licence');
    }
  };

  const getFurnitureFormFields = () => {
    const furnitureFields = {};

    furnitureFields.furnitureReady = true;
    furnitureFields.buildingType = $('#tfg-building-type').val();
    furnitureFields.parkingDistance = $('#tfg-parking-distance').val();
    furnitureFields.deliveryFloor = $('#tfg-delivery-floor').val();
    if (!$('#tfg-lift-stairs').attr('disabled')) {
      furnitureFields.liftOrStairs = $('#tfg-lift-stairs').val();
    }
    furnitureFields.hasSufficientSpace = $('#tfg-sufficient-space').is(':checked');
    furnitureFields.assembleFurniture = $('#tfg-assemble-furniture').is(':checked');

    return furnitureFields;
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

  const getTVFormFields = () => ({ tvID: $('#tfg-tv-licence').val() });

  const saveShippingForm = () => {
    const { showFurnitureForm, showRICAForm, showTVIDForm } = ViewController.state;

    checkForms(showFurnitureForm, showRICAForm, showTVIDForm);

    if (state.validForm) {
      // Fields saved in orderForm
      if (showRICAForm) {
        const ricaFields = getRICAFields();

        checkoutSendCustomData(RICA_APP, ricaFields);
      }

      // Fields saved in Masterdata
      const masterdataFields = {};

      if (showFurnitureForm) {
        Object.assign(masterdataFields, getFurnitureFormFields());
      }

      if (showTVIDForm) {
        Object.assign(masterdataFields, getTVFormFields());
      }

      saveAddress(masterdataFields, true);

      setTimeout(() => {
        // $('#btn-go-to-payment').trigger('click');
        window.location.hash = STEPS.PAYMENT;
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

  const goToShipping = (event) => {
    event.preventDefault();
    checkForms();

    if (state.validForm) {
      $('#btn-go-to-shippping-method').trigger('click');

      setTimeout(() => {
        const addressFormFields = JSON.parse(localStorage.getItem('custom-address-form-fields'));
        saveAddress(addressFormFields);
      }, 4500);
      /* I give more time than necessary to make sure that VTEX saves correctly in the first step */
    }
  };

  const addCustomGoToShippingBtn = () => {
    if ($('#custom-btn-go-to-shippping-method').length <= 0) {
      const nativeGoToShippingBtn = $('#btn-go-to-shippping-method');
      const customGoToShippingBtn = nativeGoToShippingBtn.clone(false);

      $(nativeGoToShippingBtn).hide();
      $(customGoToShippingBtn).data('bind', '');
      $(customGoToShippingBtn).removeAttr('id').attr('id', 'btn-go-to-shippping-method');
      $(customGoToShippingBtn).removeAttr('data-bind');
      $(customGoToShippingBtn).attr('id', 'custom-btn-go-to-shippping-method');
      $(customGoToShippingBtn).css('display', 'block');

      $('p.btn-go-to-shipping-wrapper').append(customGoToShippingBtn);

      $(customGoToShippingBtn).on('click', goToShipping);
    }
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');

      if (selectedDelivery) {
        addCustomBtnPayment();
        addCustomGoToShippingBtn();
      }
    }
  };

  // INPUT EVENT SUBSCRIPTION
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

  $(document).on('change', '.vtex-omnishipping-1-x-addressForm input', function () {
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

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  const publicInit = () => { };

  return {
    init: publicInit,
    state
  };
})();

export default FormController;
