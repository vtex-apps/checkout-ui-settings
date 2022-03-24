/* eslint-disable func-names */
import {
  STEPS,
  ORDERFORM_TIMEOUT,
  /* CUSTOM_FIELDS_APP */
} from '../utils/const';
import {
  getCustomShippingData,
  getCustomShippingDataFromLS
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
      'ship-state',
      'ship-receiverName'
    ];

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

  const checkForms = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;

    // Reset state & clear errors
    $('span.help.error').remove();
    state.validForm = true;

    checkNativeForm();

    if (showFurnitureForm) {
      checkFurnitureForm();
    }

    if (showTVIDForm) {
      checkField('tfg-tv-licence');
    }
  };

  // TODO: LEFT HERE FOR RICA FIELDS
  /*
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
  */

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

    localStorage.setItem('furnitureFields', JSON.stringify(furnitureFields));
  };

  const saveTVForm = () => {
    const TVFields = {
      tvID: $('#tfg-tv-licence').val()
    };

    localStorage.setItem('TVFields', JSON.stringify(TVFields));
  };

  // TODO: here @josue :)
  function saveShippingAddress() {
    console.log('hi');

    const { orderFormId } = vtexjs.checkout.orderForm;
    const params = {
      method: 'PATCH',
      headers: {
        VtexIdclientAutCookie: ''
      },
      body: JSON.stringify({
        complement: 'teeeest',
        companyBuilding: 'test'
      })
    };

    console.log(params);

    fetch(`safedata/AD/documents?_orderFormId=${orderFormId}`, params)
      .then((response) => response.json())
      .catch((error) => console.log(error))
      .then((data) => data);

    /*
    // waiting a few ms for save custom data
    setTimeout(() => {
      $('#btn-go-to-payment').trigger('click');
    }, 300);
    */
  }

  const checkShippingFields = () => {
    const { showFurnitureForm, showTVIDForm } = ViewController.state;

    checkForms();

    if (state.validForm) {
      saveShippingAddress();

      if (showFurnitureForm) {
        saveFurnitureForm();
      }

      if (showTVIDForm) {
        saveTVForm();
      }
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

  const setValues = () => {
    if (vtexjs.checkout.orderForm) {
      const { showFurnitureForm, showTVIDForm } = ViewController.state;
      let customShippingInfo = getCustomShippingData();

      if (!customShippingInfo) {
        customShippingInfo = getCustomShippingDataFromLS();
      }

      console.log('-- customShippingInfo', customShippingInfo);

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
      setTimeout(() => {
        addCustomBtnPayment();
        setValues();
      }, ORDERFORM_TIMEOUT);
    }
  };

  // INPUT EVENT SUBSCRIPTION
  $(document).on('change', '.vtex-omnishipping-1-x-address #tfg-delivery-floor', function () {
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
    '.vtex-omnishipping-1-x-address .tfg-custom-selector, .vtex-omnishipping-1-x-address .tfg-input',
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

  const publicInit = () => {
    window.FormController = this;
  };

  return {
    init: publicInit,
    state
  };
})();

export default FormController;
