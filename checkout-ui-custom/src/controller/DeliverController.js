import DeliverContainer from '../partials/Deliver/DeliverContainer';
import ExtraFieldsContainer from '../partials/Deliver/ExtraFieldsContainer';
import {
  clearRicaFields,
  customShippingDataIsValid,
  parseAttribute,
  populateAddressForm,
  populateDeliveryError,
  populateRicaFields,
  populateTVFields,
  preparePhoneField,
  setAddress,
  setCartClasses,
  submitAddressForm,
  submitDeliveryForm,
  updateDeliveryFeeDisplay
} from '../partials/Deliver/utils';
import { AD_TYPE, STEPS } from '../utils/const';
import { getSpecialCategories, scrollToInvalidField } from '../utils/functions';
import sendEvent from '../utils/sendEvent';
import { clearAddresses, getAddressByName, removeFromCart } from '../utils/services';

const DeliverController = (() => {
  const state = {
    view: 'list',
    hasFurn: false,
    hasTVs: false,
    hasSim: false,
    hasFurnMixed: false,
    hasFurnOnly: false,
  };

  const unblockShippingError = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      if ($('.shipping-summary-info').length && $('.shipping-summary-info').text() === 'Waiting for more information') {
        window.location.hash = STEPS.PROFILE;
        sendEvent({
          action: 'stepRedirect',
          label: 'redirectShippingToProfile',
          description: 'User redirect to profile - "Waiting for more information" error.',
        });
      }
    }
  };

  const setupDeliver = () => {
    unblockShippingError();

    if ($('#bash--delivery-container').length) return;

    if (window.vtexjs.checkout.orderForm) {
      const items = window.vtexjs.checkout.orderForm?.items;
      const { hasFurniture, hasTVs, hasSimCards, hasFurnitureMixed, hasFurnitureOnly } = getSpecialCategories(items);

      state.hasFurn = hasFurniture;
      state.hasTVs = hasTVs;
      state.hasSim = hasSimCards;
      state.hasFurnOnly = hasFurnitureOnly;
      state.hasFurnMixed = hasFurnitureMixed;
    }

    $('.shipping-data .box-step').append(
      DeliverContainer({
        hasFurnOnly: state.hasFurnOnly,
        hasFurnMixed: state.hasFurnMixed,
      }),
    );

    const showExtraFields = state.hasFurn || state.hasSim || state.hasTVs;

    if (showExtraFields) {
      $('#bash-delivery-options').before(
        ExtraFieldsContainer({
          hasFurn: state.hasFurn,
          hasSim: state.hasSim,
          hasTV: state.hasTVs,
        }),
      );

      if (state.hasSim) populateRicaFields();
      if (state.hasTVs) populateTVFields();
    }

    const fieldsToValidate = 'select, input';
    // eslint-disable-next-line func-names
    $(fieldsToValidate).on('invalid', function () {
      const field = this;
      $(field)[0].setCustomValidity(' ');
      $(field).parents('form').addClass('show-form-errors');
      $(field).off('change keyUp');
      $(field).on('change keyUp', () => {
        $(field)[0].setCustomValidity('');
      });
    });
  };

  // EVENTS

  $(window).unload(() => {
    clearAddresses();
  });

  $(document).ready(() => {
    try {
      window.vtexjs.checkout.getOrderForm().then(() => {
        clearAddresses();
        if (window.location.hash === STEPS.SHIPPING) {
          setupDeliver();
          $('.bash--delivery-container.hide').removeClass('hide');
          $('.bash--delivery-container').css('display', 'flex');
        } else if ($('.bash--delivery-container:not(.hide)').length) {
          $('.bash--delivery-container:not(.hide)').addClass('hide');
          $('.bash--delivery-container').css('display', 'none');
        }
      });
    } catch (e) {
      console.error('VTEX_ORDERFORM_ERROR: Could not load at Deliver controller', e);
      sendEvent({
        eventCategory: 'Checkout_SystemError',
        action: 'OrderFormFailed',
        label: 'Could not getOrderForm() from vtex',
        description: 'Could not load orderForm at Deliver.'
      });
    }
  });

  $(window).on('hashchange', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setupDeliver();
      setCartClasses();
      $('.bash--delivery-container').css('display', 'flex');
      $('.bash--delivery-container.hide').removeClass('hide');
    } else if ($('.bash--delivery-container:not(.hide)').length) {
      $('.bash--delivery-container:not(.hide)').addClass('hide');
      $('.bash--delivery-container').css('display', 'none');
    }
  });

  // Define which tab is active ;/
  $(window).on('orderFormUpdated.vtex', () => {
    const items = window.vtexjs.checkout.orderForm?.items;
    const addressType = window.vtexjs.checkout.orderForm.shippingData?.address?.addressType;
    const { hasTVs, hasSimCards, hasFurnitureMixed } = getSpecialCategories(items);
    const { messages } = window.vtexjs.checkout.orderForm;

    if (window.location.hash === STEPS.SHIPPING) {
      const errors = messages.filter((msg) => msg.status === 'error');
      if (errors) populateDeliveryError(errors);
    }

    if (addressType === AD_TYPE.PICKUP) {
      // User has Collect enabled, but has Rica or TV products,
      // or Furniture + Non Furn.
      if (hasTVs || hasSimCards || hasFurnitureMixed) {
        if (window.location.hash !== STEPS.SHIPPING) window.location.hash = STEPS.SHIPPING;
        setTimeout(() => document.getElementById('shipping-option-delivery')?.click(), 2000);
        return;
      }
      $('#shipping-data:not(collection-active)').addClass('collection-active');
      $('.delivery-active').removeClass('delivery-active');
    } else {
      setupDeliver();
      $('#shipping-data:not(delivery-active)').addClass('delivery-active');
      $('.collection-active').removeClass('collection-active');
    }

    setCartClasses();
    updateDeliveryFeeDisplay();

    if (window.location.hash === STEPS.PAYMENT && !customShippingDataIsValid()) {
      scrollToInvalidField();
      window.location.hash = STEPS.SHIPPING;
    }
  });

  // Change view
  $(document).on('click', 'a[data-view]', function (e) {
    e.preventDefault();
    const viewTarget = $(this).data('view');
    const content = decodeURIComponent($(this).data('content'));
    window.postMessage({ action: 'setDeliveryView', view: viewTarget, content });
  });

  // Select address
  $(document).on('change', 'input[type="radio"][name="selected-address"]', function () {
    const address = parseAttribute($(this).parents('.bash--address-listing').data('address'));

    if (document.forms['bash--delivery-form']) {
      document.forms['bash--delivery-form'].reset();
      // reset prepopulated lat and long
      $('#bash--input-lat').val('');
      $('#bash--input-lng').val('');
      document.forms['bash--delivery-form'].classList.remove('show-form-errors');
    }

    if (!address) return;

    getAddressByName(address.addressName).then((addressByName) => {
      setAddress(addressByName || address, { validateExtraFields: false });
      $('input[type="radio"][name="selected-address"]:checked').attr('checked', false);
      $(this).attr('checked', true);
    });
  });

  // Rica - show/hide address fields
  $(document).on('change', '#bash--input-rica_sameAddress', function () {
    if (this.checked) {
      $('.rica-conditional-fields').slideUp(() => populateRicaFields());
    } else {
      clearRicaFields();
      $('.rica-conditional-fields').slideDown(() => $('#bash--input-rica_fullName').focus());
    }
  });

  // address type - change building/complex label to either business
  $(document).on('change', 'input[name="addressType"]', function () {
    if ($(this).is(':checked')) {
      if ($(this).val() === 'business') {
        $('#bash--label-companyBuilding').text('Business name');
      } else {
        $('#bash--label-companyBuilding').text('Building/Complex and number');
      }
    }
  });

  // switching to between shipping options
  // hide delivery container when switching to collect
  $(document).on('click', '#shipping-option-pickup-in-point, #shipping-option-delivery', function () {
    const clickedButton = $(this).attr('id');
    if (clickedButton === 'shipping-option-pickup-in-point') {
      $('#bash--delivery-container').hide();
    } else {
      $('#bash--delivery-container').show();
    }
  });

  $(document).on('submit', '#bash--address-form', submitAddressForm);
  $(document).on('submit', '#bash--delivery-form', submitDeliveryForm);

  $(document).on('click', '.remove-cart-item', function (e) {
    e.preventDefault();
    removeFromCart($(this).data('index'));
  });

  // Form validation
  window.addEventListener('message', (event) => {
    const { data } = event;
    if (!data || !data.action) return;

    switch (data.action) {
      case 'setDeliveryView':
        document.querySelector('.bash--delivery-container')?.setAttribute('data-view', data.view);
        if (data.view === 'address-form' || data.view === 'address-edit') {
          preparePhoneField('#bash--input-complement');
          if (data.content) {
            try {
              const address = JSON.parse(decodeURIComponent($(`#${data.content}`).data('address')));
              populateAddressForm(address);
            } catch (e) {
              console.warn('Could not parse address Json', data.content);
            }
          }
        }
        break;
      case 'FB_LOG':
        break;
      default:
        console.error('Unknown action', data.action);
    }
  });

  // Clear local checkout DB on ext.
  // window.addEventListener('beforeunload', clearAddresses);

  return {
    state,
    init: () => { },
  };
})();
export default DeliverController;
