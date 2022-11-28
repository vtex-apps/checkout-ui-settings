import AddressTypeField from '../partials/AddressTypeField';
import { STEPS, TIMEOUT_500 } from '../utils/const';
import { clearLoaders, getSpecialCategories } from '../utils/functions';
import { getBestPhoneNumber } from '../utils/phoneFields';
import setTranslations from '../utils/translations';
import setReceiverPhoneNumber from '../utils/vtex';

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

  const toggleGoogleInput = () => {
    $('.body-order-form #shipping-data .vcustom--vtex-omnishipping-1-x-address > div > form').toggleClass('google');
    const selector = `.vcustom--vtex-omnishipping-1-x-address__state, .v-custom-ship-info,
        .btn-go-to-shipping-wrapper`;
    $(selector).hide();
    $('.v-custom-ship-street label').text('Add a new delivery address');
    $('#v-custom-ship-street').attr('placeholder', 'Search for address');

    $('#v-custom-ship-street').one('change', () => {
      $('.body-order-form #shipping-data .vcustom--vtex-omnishipping-1-x-address > div > form').toggleClass('google');
      $(selector).show();
      $('.v-custom-ship-street label').text('Street address');
      $('#v-custom-ship-street').attr(
        'placeholder',
        'Eg: 234 Brickfield Rd, Salt River, Cape Town, 7501, South Africa'
      );
    });
  };

  const populateDeliveryPhone = () => {
    if (window.vtexjs.checkout.orderForm?.shippingData?.address?.complement || $('#ship-complement').val()) return;

    const phoneNumber = getBestPhoneNumber();
    if (!window.vtexjs.checkout.orderForm?.shippingData?.address?.complement) {
      setReceiverPhoneNumber(phoneNumber);
    }

    if ($('#ship-complement').val() === '') $('#ship-complement').val(phoneNumber);
  };

  const runCustomization = () => {
    if (!window.vtexjs.checkout.orderForm) return;

    const { items, shippingData } = window.vtexjs.checkout.orderForm;
    if (!shippingData || items.length < 1) return;

    const { address } = shippingData;
    const { furniture, TVs, SimCards } = getSpecialCategories(items);
    const cannotCollect = furniture || SimCards || TVs;

    if (address?.addressType === 'search' && cannotCollect) {
      $('#shipping-data').addClass('shimmer');
      const selectedDelivery = $('#shipping-option-delivery');
      selectedDelivery.trigger('click');
      if (window.location.hash === STEPS.PAYMENT) {
        window.location.replace(STEPS.SHIPPING);
      }
    }

    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');
        setTranslations();
        if (window.location.hash === STEPS.SHIPPING && selectedDelivery) {
          setAddressType();
          toggleGoogleInput();
          populateDeliveryPhone();
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

  $(document).on('change', 'input[name="ship-addressType"]', () => {
    localStorage.setItem('addressType', document.querySelector('input[name="ship-addressType"]:checked').value);
  });

  const publicInit = () => {};

  return {
    init: publicInit,
    state,
  };
})();

export default AddressController;
