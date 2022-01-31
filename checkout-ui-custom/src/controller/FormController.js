import {
  STEPS,
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
    if ($('#btn-go-to-payment').attr('captureEvt') === undefined) {
      $('#btn-go-to-payment').attr('captureEvt', '0');

      $(document).on('click', '#shipping-data #btn-go-to-payment', (o) => {
        const btn = $(this);

        if (btn.attr('captureEvt') !== '1') {
          // Block native behaviour
          o.preventDefault();
          o.stopImmediatePropagation();

          // Custom fields validations
          checkCustomFields();

          if (state.valid) {
            saveFurnitureForm().then(() => {
              $('#btn-go-to-payment').attr('captureEvt', '1');
              $('#btn-go-to-payment').attr('disabled', false);

              // Execute native behaviour
              // $('#btn-go-to-payment').click();
            });

            btn.attr('disabled', true);
          }
        } else {
          btn.attr('captureEvt', '0');
        }
      });
    }
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      addEventBtnShipping();
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
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
