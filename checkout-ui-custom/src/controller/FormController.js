/* eslint-disable func-names */
import {
  STEPS,
  ORDERFORM_TIMEOUT,
  CUSTOM_FIELDS_APP
} from '../utils/const';
import ViewController from './ViewController';

const FormController = (() => {
  const state = {
    validForm: true
  };

  const checkNativeForm = () => {
    const nativeFields = [
      'ship-street',
      'ship-city',
      'ship-state',
      'ship-receiverName'
    ];

    nativeFields.forEach((field) => {
      if ($(`#${field}`).length > 0 && !$(`#${field}`).val()) {
        $(`.${field}`).addClass('error');
        state.validForm = false;
      } else {
        $(`.${field}`).removeClass('error');
      }
    });
    console.log('post checkNativeForm', state);
  };

  const checkFurnitureForm = () => {
    const furnitureFields = [
      'tfg-building-type',
      'tfg-parking-distance',
      'tfg-delivery-floor',
      'tfg-lift-stairs'
    ];

    furnitureFields.forEach((field) => {
      if ($(`#${field}`).length > 0 && !$(`#${field}`).attr('disabled') && !$(`#${field}`).val()) {
        $(`.${field}`).addClass('error');
        state.validForm = false;
      } else {
        $(`.${field}`).removeClass('error');
      }
    });
    console.log('post checkFurnitureForm', state);
  };

  const checkTVForm = () => {
    if ($('#tfg-tv-licence').length > 0 && !$('#tfg-tv-licence').val()) {
      $('.tfg-tv-licence').addClass('error');
      state.validForm = false;
    } else {
      $('.tfg-tv-licence').removeClass('error');
    }
    console.log('post checkTVForm', state);
  };

  const checkFields = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;

    // Reset state
    state.validForm = true;

    console.log('ViewController.state', ViewController.state);
    console.log('pre checkNativeForm', state);

    checkNativeForm();

    if (showFurnitureForm) {
      console.log('pre checkFurnitureForm', state);
      checkFurnitureForm();
    }

    if (showTVIDForm) {
      console.log('pre checkTVForm', state);
      checkTVForm();
    }
  };

  const checkoutSendCustomData = (appId, customData) => {
    const { orderFormId } = vtexjs.checkout.orderForm;

    return $.ajax({
      type: 'PUT',
      url:
        `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}`,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(customData)
    });
  };

  const saveFurnitureForm = () => {
    const furnitureFields = {};

    furnitureFields.buildingType = $('#tfg-building-type').val();
    furnitureFields.parkingDistance = $('#tfg-parking-distance').val();
    furnitureFields.deliveryFloor = $('#tfg-delivery-floor').val();
    if (!$('#tfg-lift-stairs').attr('disabled')) {
      furnitureFields.liftOrStairs = $('#tfg-lift-stairs').val();
    }
    furnitureFields.hasSufficientSpace = $('#tfg-sufficient-space').is(':checked');
    furnitureFields.assembleFurniture = $('#tfg-assemble-furniture').is(':checked');

    checkoutSendCustomData(CUSTOM_FIELDS_APP, furnitureFields);
  };

  const saveTVForm = () => {
    const TVFields = {
      tvID: $('#tfg-tv-licence').val()
    };

    checkoutSendCustomData(CUSTOM_FIELDS_APP, TVFields);
  };

  function saveShippingAddress() {
    $('#btn-go-to-payment').trigger('click');
  }

  const checkShippingFields = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;

    checkFields();

    if (state.validForm) {
      if (showFurnitureForm) {
        saveFurnitureForm();
      }

      if (showTVIDForm) {
        saveTVForm();
      }

      saveShippingAddress();
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
      $(customPaymentBtn).on('click', checkShippingFields);
    }
  };

  const getCustomShippingInfo = () => {
    const { customData } = vtexjs.checkout.orderForm;
    let fields = {};

    if (customData && customData.customApps && customData.customApps.length > 0) {
      customData.customApps.forEach((app) => {
        if (app.id === CUSTOM_FIELDS_APP) {
          fields = app.fields;
        }
      });
    }

    return fields;
  };

  const setValues = () => {
    setTimeout(() => {
      if (vtexjs.checkout.orderForm) {
        const { showFurnitureForm, showTVIDForm } = ViewController.state;
        const customShippingInfo = getCustomShippingInfo();

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
    }, ORDERFORM_TIMEOUT);
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      // addEventBtnShipping();
      addCustomBtnPayment();
      setValues();
    }
  };

  // INPUT EVENT SUBSCRIPTION
  $(document).on('change', '.vtex-omnishipping-1-x-deliveryGroup #tfg-delivery-floor', function () {
    if ($(this).val() === 'Ground') {
      $('#tfg-lift-stairs').val('');
      $('#tfg-lift-stairs').attr('disabled', 'disabled');
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

  $(window).on('hashchange', () => {
    runCustomization();
  });

  $(window).on('orderFormUpdated.vtex', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setValues();
    }
  });

  const publicInit = () => {
    window.FormController = this;
  };

  return {
    init: publicInit,
    state
  };
})();

export default FormController;
