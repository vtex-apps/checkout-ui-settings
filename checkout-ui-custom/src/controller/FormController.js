/* eslint-disable func-names */
import { ERRORS, FURNITURE_APP, RICA_APP, STEPS, TIMEOUT_750, TV_APP } from '../utils/const';
import { checkoutSendCustomData, saveAddress, setRicaFields } from '../utils/functions';
import { validatePhoneNumber } from '../utils/phoneFields';
import ViewController from './ViewController';

import InputError from '../templates/InputError';

const FormController = (() => {
  const state = {
    validForm: true,
    errorFields: []
  };

  const checkField = (field) => {
    if (field === 'ship-complement') {
      const $phoneFieldContainer = $('.vtex-omnishipping-1-x-address .ship-complement');
      const phoneNumber = $('.vtex-omnishipping-1-x-address input#ship-complement').val();

      if (!validatePhoneNumber(phoneNumber)) {
        $phoneFieldContainer.addClass('error').append(InputError(ERRORS.PHONE));
        $phoneFieldContainer.find('span.error').show();
        state.errorFields.push(field);
        state.validForm = false;
      } else {
        $phoneFieldContainer.removeClass('error');
      }
      return;
    }

    if ($(`#${field}`).length > 0 && !$(`#${field}`).attr('disabled') && !$(`#${field}`).val()) {
      $(`.${field}`).addClass('error').append(InputError());
      $(`.${field} span.error`).show();
      state.errorFields.push(field);
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

  const checkAddressForm = () => {
    // "ship-complement" = Customer Phone number
    checkFields(['ship-street', 'ship-receiverName', 'ship-complement']);
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

  const checkForm = () => {
    console.log('Check Form Form');
    $('span.help.error')?.remove();
    state.validForm = true;
    state.errorFields = [];

    /* Checking Receiver & Receiver Phone */
    if ($('div.address-list.vtex-omnishipping-1-x-addressList').length <= 0) {
      checkAddressForm();
    }

    /* Checking Custom Fields */
    if (ViewController.state.showFurnitureForm) {
      checkFurnitureForm();
    }
    if (ViewController.state.showRICAForm) {
      checkRICAForm();
    }
    if (ViewController.state.showTVIDForm) {
      checkField('tfg-tv-licence');
    }

    if (state.errorFields.length > 0 && document.getElementById(state.errorFields[0])) {
      document.getElementById(state.errorFields[0]).focus();
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
    const { showFurnitureForm, showRICAForm, showTVIDForm } = ViewController.state;

    checkForm();

    console.log('!! saveShippingForm - state', state);

    if (state.validForm) {
      // Fields saved in orderForm
      if (showRICAForm) {
        const ricaFields = getRICAFields();
        checkoutSendCustomData(RICA_APP, ricaFields);
      }

      // Fields saved in Masterdata
      const masterdataFields = {};

      if (showFurnitureForm) {
        const furnitureFields = getFurnitureFormFields();
        checkoutSendCustomData(FURNITURE_APP, furnitureFields);
        Object.assign(masterdataFields, furnitureFields);
      }
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
    if (window.location.hash === STEPS.SHIPPING) {
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
    const elementToObserveChange = document.querySelector('.shipping-container .box-step');
    const observerConfig = { attributes: false, childList: true, characterData: false };
    const observer = new MutationObserver(() => {
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
        $(this).next('span.help.error')?.remove();
        $(this).addClass('tfg-input-completed');
      } else {
        $(this).removeClass('tfg-input-completed');
      }
    }
  );

  $(document).on('change', '.vtex-omnishipping-1-x-addressForm input', function () {
    if ($(this).val()) {
      $(this).parent().removeClass('error');
      $(this).next('span.help.error')?.remove();
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

  const publicInit = () => {};

  return {
    init: publicInit,
    state
  };
})();

export default FormController;
