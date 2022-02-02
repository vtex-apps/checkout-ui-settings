import {
  STEPS,
  ORDERFORM_TIMEOUT,
  CUSTOM_FIELDS_APP
} from '../utils/const';
import ViewController from './ViewController';

const FormController = (() => {
  const state = {
    valid: true
  };

  const checkFurnitureForm = () => {
    const furnitureFields = [
      'tfg-building-type',
      'tfg-parking-distance',
      'tfg-delivery-floor',
      'tfg-lift-stairs'
    ];
    let hasError = false;

    furnitureFields.forEach((field) => {
      if ($(`#${field}`).length > 0 && !$(`#${field}`).val()) {
        $(`#${field}`).addClass('error');
        hasError = true;
      } else {
        $(`#${field}`).removeClass('error');
      }
    });

    return hasError;
  };

  const checkCustomFields = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;
    let furnitureFormError = false;
    const TVIDFormError = false;

    if (showFurnitureForm) {
      furnitureFormError = checkFurnitureForm();
    }

    if (showTVIDForm) {
      // TODO  checkTVIDForm();
    }

    state.valid = (!furnitureFormError || !TVIDFormError);
  };

  const checkNativeFields = () => {
    const shippingFields = [
      '#ship-street',
      '#ship-number',
      '#ship-city'
    ];

    shippingFields.forEach((field) => {
      if ($(`${field}`).length > 0 && !$(`${field}`).val()) {
        $(`${field}`).addClass('error');
        state.valid = false;
      }
    });
  };

  const checkoutSendCustomData = (appId, customData) => {
    // eslint-disable-next-line no-undef
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
    furnitureFields.liftOrStairs = $('#tfg-lift-stairs').val();
    furnitureFields.hasSufficientSpace = $('#tfg-sufficient-space').is(':checked');
    furnitureFields.assembleFurniture = $('#tfg-assemble-furniture').is(':checked');

    checkoutSendCustomData(CUSTOM_FIELDS_APP, furnitureFields);
  };

  function saveShippingAddress() {
    $('#btn-go-to-payment').trigger('click');
  }

  const checkShippingFields = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;

    checkNativeFields();
    checkCustomFields();

    if (state.valid) {
      if (showFurnitureForm) {
        saveFurnitureForm();
      }

      if (showTVIDForm) {
        // TODO GUARDADO TVID
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
            $('#tfg-lift-stairs').val(customShippingInfo.liftOrStairs);
            $('#tfg-sufficient-space').prop('checked', (customShippingInfo.hasSufficientSpace === 'true'));
            $('#tfg-assemble-furniture').prop('checked', (customShippingInfo.assembleFurniture === 'true'));
          }

          if (showTVIDForm) {
            // TODO:set tvid field
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
