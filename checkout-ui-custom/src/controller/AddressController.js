import AddressTypeField from '../partials/AddressTypeField';
import { STEPS, TIMEOUT_500 } from '../utils/const';
import { clearLoaders, getAddresses, getSpecialCategories } from '../utils/functions';
import { getBestPhoneNumber } from '../utils/phoneFields';
import setTranslations from '../utils/translations';
import setReceiverPhoneNumber from '../utils/vtex';
import ViewController from './ViewController';

const AddressController = (() => {
  const state = {
    intTelInput: {},
    captureGoogleInputOnChange: false,
    captureAddressListOnChange: false,
  };

  const setAddressType = () => {
    const addressTypeInput = document.querySelector('.vtex-omnishipping-1-x-address .ship-addressType');

    if (!addressTypeInput) {
      const addressTypeSelected = window.vtexjs.checkout.orderForm.shippingData?.address?.addressType;
      $('.ship-receiverName').after(AddressTypeField(addressTypeSelected));
    }
  };

  const setProvinceSelect = () => {
    if (!document.getElementById('ship-state')) return;

    if (document.getElementById('ship-state')?.options?.[0]?.text === 'State') {
      document.getElementById('ship-state').options[0].text = 'Select';
    }
  };

  const populateDeliveryPhone = () => {
    if (window.vtexjs.checkout.orderForm?.shippingData?.address?.complement || $('#ship-complement').val()) return;

    const phoneNumber = getBestPhoneNumber();
    if (!window.vtexjs.checkout.orderForm?.shippingData?.address?.complement) {
      setReceiverPhoneNumber(phoneNumber);
    }

    if ($('#ship-complement').val() === '') $('#ship-complement').val(phoneNumber);
  };

  const checkCollectTab = () => {
    const { items, shippingData } = window.vtexjs.checkout.orderForm;
    if (!shippingData || items.length < 1) return;

    const { address } = shippingData;
    const { hasTVs, hasSimCards } = getSpecialCategories(items);
    const cannotCollect = hasSimCards || hasTVs;

    if (cannotCollect) {
      if (address?.addressType === 'search') {
        $('#shipping-data').addClass('shimmer');
        $('#shipping-option-delivery').trigger('click');

        // If user is on Payment, take them to Delivery
        if (window.location.hash !== STEPS.SHIPPING) window.location.hash = STEPS.SHIPPING;
      } else {
        // If collect tab is clickable, fix it...
        ViewController.showCustomSections();
      }
    }
  };

  const runCustomization = () => {
    if (!window.vtexjs.checkout.orderForm) return;

    const addresses = getAddresses();
    console.info({ addresses });

    checkCollectTab();

    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');
        setTranslations();
        if (window.location.hash === STEPS.SHIPPING && selectedDelivery) {
          setAddressType();
          populateDeliveryPhone();
          setProvinceSelect();
        }
      }, TIMEOUT_500);
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    clearLoaders();
    runCustomization();
  });

  $(document).on('click', '#edit-shipping-data', () => {
    runCustomization();
  });

  // TODO keep this?
  $(document).on('change', 'input[name="ship-addressType"]', () => {
    localStorage.setItem('addressType', document.querySelector('input[name="ship-addressType"]:checked').value);
  });

  $(document).on('click', '#force-shipping-fields, #edit-address-button', () => {
    // ViewController.setDataInCustomFields();
    ViewController.setView('edit-address');
  });

  $(document).on('click', '#new-address-button', () => {
    ViewController.setView('address-search');
    $('.v-custom-ship-street label').text('Search for address');
    $('#v-custom-ship-street').attr('placeholder', 'Start typing and address');
  });

  $(document).on('click', '#back-to-address-list', () => {
    ViewController.setView('address-list');
  });

  $(document).on('click', '.address-list > label', () => {
    $('.address-list').addClass('shimmer');
  });

  $(document).on('change', '[data-delivery-view="address-search"] #v-custom-ship-street', () => {
    ViewController.setView('add-address');
    $('.v-custom-ship-street label').text('Street address');
    $('#v-custom-ship-street').attr('placeholder', 'Eg: 234 Brickfield Rd, Salt River, Cape Town, 7501, South Africa');
  });

  return {
    state,
    init: () => {},
  };
})();

export default AddressController;
