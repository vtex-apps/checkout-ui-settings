/* eslint-disable no-undef */
import {
  STEPS,
  ORDERFORM_TIMEOUT,
  CUSTOM_FIELDS_APP
} from '../utils/const';
import ViewController from './ViewController';

const FormController = (() => {
  const state = {
    valid: false
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
    let TVIDFormError = false;

    if (showFurnitureForm) {
      furnitureFormError = checkFurnitureForm();
    }

    if (showTVIDForm) {
      // TVIDFormError = checkTVIDForm(); // TODO: MODIFICAR
    }

    state.valid = (!furnitureFormError && !TVIDFormError);
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

    return checkoutSendCustomData(CUSTOM_FIELDS_APP, furnitureFields);
  };

  const addEventBtnShipping = () => {
    if ($('#shipping-data #btn-go-to-payment').attr('captureFurnitureEvt') === undefined) {
      $('#shipping-data #btn-go-to-payment').attr('captureFurnitureEvt', '0');

      $(document).on('click', '#shipping-data #btn-go-to-payment', (e) => {
        const btn = $(this);

        if (btn.attr('captureFurnitureEvt') !== '1') {
          // Block native behaviour
          e.stopImmediatePropagation();
          e.preventDefault();

          // Custom fields validations
          checkCustomFields();

          if (state.valid) {
            saveFurnitureForm();

            $('#shipping-data #btn-go-to-payment').attr('captureFurnitureEvt', '1');

            // Execute native behaviour
            btn.click();
          }
        } else {
          btn.attr('captureFurnitureEvt', '0');
        }
      });
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
      addEventBtnShipping();
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
