/* eslint-disable func-names */
import {
  STEPS,
  ORDERFORM_TIMEOUT,
  RICA_APP
} from '../utils/const';
import {
  getShippingData,
  saveAddress,
  checkoutGetCustomData,
  checkoutSendCustomData
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
      'ship-street',
      'ship-city',
      'ship-receiverName'
    ];

    /* When the list of addresses appears,
    it does not complete ship-state correctly in the native process so,
    if it has already been reported, it is not validated. */
    const { address } = vtexjs.checkout.orderForm.shippingData;

    if (!address.state) {
      nativeFields.push('ship-state');
    }

    checkFields(nativeFields);
  };

  const checkFurnitureForm = () => {
    const furnitureFields = [
      'tfg-building-type',
      'tfg-parking-distance',
      'tfg-delivery-floor',
      'tfg-lift-stairs'
    ];

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

  const checkForms = () => {
    const { showFurnitureForm, showRICAForm, showTVIDForm } = ViewController.state;

    // Reset state & clear errors
    $('span.help.error').remove();
    state.validForm = true;

    checkNativeForm();

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

    checkForms();

    if (state.validForm) {
      // Fields saved in orderForm
      if (showRICAForm) {
        const ricaFields = getRICAFields();

        checkoutSendCustomData(RICA_APP, ricaFields);
      }

      // Fields saved in Masterdata
      let masterdataFields;

      if (showFurnitureForm) {
        masterdataFields = { ...getFurnitureFormFields() };
      }

      if (showTVIDForm) {
        masterdataFields = { ...getTVFormFields() };
      }

      saveAddress(masterdataFields);

      setTimeout(() => {
        $('#btn-go-to-payment').trigger('click');
      }, 800);
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

  const setCustomFieldsValue = async () => {
    if (vtexjs.checkout.orderForm) {
      const { showFurnitureForm, showTVIDForm } = ViewController.state;
      const { addressId } = vtexjs.checkout.orderForm.shippingData.address;
      const fields = '?_fields=companyBuilding,furnitureReady,buildingType,'
        + 'parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';

      const customShippingInfo = await getShippingData(addressId, fields);

      if (customShippingInfo) {
        if (showFurnitureForm) {
          $('#tfg-building-type').val(customShippingInfo.buildingType);
          $('#tfg-parking-distance').val(customShippingInfo.parkingDistance);
          $('#tfg-delivery-floor').val(customShippingInfo.deliveryFloor);
          if ($('#tfg-delivery-floor').val() === 'Ground') {
            $('#tfg-lift-stairs').attr('disabled', 'disabled');
          } else {
            $('#tfg-lift-stairs').val(customShippingInfo.liftOrStairs);
          }
          $('#tfg-sufficient-space').prop('checked', (customShippingInfo.hasSufficientSpace === 'true'));
          $('#tfg-assemble-furniture').prop('checked', (customShippingInfo.assembleFurniture === 'true'));
        }

        if (showTVIDForm) {
          $('#tfg-tv-licence').val(customShippingInfo.tvID);
        }
      }
    }
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(async () => {
        addCustomBtnPayment();
        await setCustomFieldsValue();
      }, ORDERFORM_TIMEOUT);
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

  $(document).on('change',
    '.vtex-omnishipping-1-x-deliveryGroup .tfg-custom-selector, .vtex-omnishipping-1-x-deliveryGroup .tfg-input',
    function () {
      if ($(this).val()) {
        $(this).parent().removeClass('error');
        $(this).next('span.help.error').remove();
        $(this).addClass('tfg-input-completed');
      } else {
        $(this).removeClass('tfg-input-completed');
      }
    });

  $(document).on('change', '.vtex-omnishipping-1-x-addressForm input', function () {
    if ($(this).val()) {
      $(this).parent().removeClass('error');
      $(this).next('span.help.error').remove();
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
