import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

import {
  COUNTRIES_AVAILABLES,
  COUNTRIES,
  STEPS,
  TIMEOUT_500
} from '../utils/const';
import setTranslations from '../utils/translations';

const AddressController = (() => {
  const state = {
    intTelInput: {},
    captureGoogleInputOnChange: false,
    captureAddressListOnChange: false
  };

  const setInputPhone = () => {
    const phoneInput = document.querySelector('.vtex-omnishipping-1-x-address input#ship-complement');

    const customPlaceholder = (_, selectedCountryData) => {
      $('.iti--allow-dropdown').attr('data-content', COUNTRIES[selectedCountryData.iso2].phonePlaceholder);
      return '';
    };

    if (phoneInput) {
      phoneInput.setAttribute('placeholder', '');

      const iti = intlTelInput(phoneInput, {
        initialCountry: COUNTRIES.za.code,
        onlyCountries: COUNTRIES_AVAILABLES,
        customPlaceholder
      });
      state.intTelInput = iti;

      if (!phoneInput.value) {
        phoneInput.value = window.vtexjs.checkout.orderForm.shippingData.address.complement || '';
        phoneInput.setAttribute('value', window.vtexjs.checkout.orderForm.shippingData.address.complement || '');
      }

      phoneInput.focus();
    }
  };

  const toggleGoogleInput = () => {
    if (!$('#v-custom-ship-street').val()) {
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
    }
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');
        setTranslations();
        if (window.location.hash === STEPS.SHIPPING && selectedDelivery) {
          setInputPhone();
          toggleGoogleInput();
        }
      }, TIMEOUT_500);
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  $(document).on('click', '#shipping-data .btn-link.vtex-omnishipping-1-x-btnDelivery', () => {
    setTimeout(() => {
      if (!$('#ship-complement').val()) {
        $('#ship-complement')
          .val(window.vtexjs.checkout.orderForm.shippingData.address.complement || '')
          .attr('value', window.vtexjs.checkout.orderForm.shippingData.address.complement || '');
      }
    }, TIMEOUT_500);
  });

  const publicInit = () => { };

  return {
    init: publicInit,
    state
  };
})();

export default AddressController;
