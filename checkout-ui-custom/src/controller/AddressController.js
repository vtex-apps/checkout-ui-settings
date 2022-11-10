import { STEPS, TIMEOUT_500 } from '../utils/const';
import setTranslations from '../utils/translations';

const AddressController = (() => {
  const state = {
    intTelInput: {},
    captureGoogleInputOnChange: false,
    captureAddressListOnChange: false,
  };

  const setAddressType = () => {
    const addressTypeInput = document.querySelector('.vtex-omnishipping-1-x-address .ship-addressType');

    if (!addressTypeInput) {
      $('.vtex-omnishipping-1-x-address > div').append(
        $('<p>').prop({
          class: 'input ship-addressType text',
          style: 'order: 3',
        })
      );

      $('.ship-addressType').append($('<label>').html('Address type'));

      $('.ship-addressType').append(
        $('<div>').prop({
          class: 'ship-addressType-container',
        })
      );

      $('.ship-addressType-container').append(
        $('<div>').prop({
          class: 'ship-addressType-div-residential',
        })
      );

      $('.ship-addressType-container').append(
        $('<div>').prop({
          class: 'ship-addressType-div-business',
        })
      );

      $('.ship-addressType-div-residential')
        .append(
          $('<input>').prop({
            type: 'radio',
            id: 'ship-addressType-residential',
            name: 'ship-addressType',
            value: 'residential',
          })
        )
        .append(
          $('<label>')
            .prop({
              for: 'ship-addressType-residential',
            })
            .html('Residential')
        );

      $('.ship-addressType-div-business')
        .append(
          $('<input>').prop({
            type: 'radio',
            id: 'ship-addressType-business',
            name: 'ship-addressType',
            value: 'commercial',
          })
        )
        .append(
          $('<label>')
            .prop({
              for: 'ship-addressType-business',
            })
            .html('Business')
        );

      const addressTypeSelected = window.vtexjs.checkout.orderForm.shippingData?.address?.addressType;
      if (addressTypeSelected === 'residential') {
        $('#ship-addressType-residential').attr('checked', true);
      } else if (addressTypeSelected === 'commercial') {
        $('#ship-addressType-business').attr('checked', true);
      }
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

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const selectedDelivery = $('#shipping-option-delivery').hasClass('shp-method-option-active');
        setTranslations();
        if (window.location.hash === STEPS.SHIPPING && selectedDelivery) {
          setAddressType();
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
      if ($('#ship-complement').val() === '') {
        const phoneNumber =
          window.vtexjs.checkout.orderForm?.clientProfileData?.phone ?? $('#client-phone').val() ?? '';

        $('#ship-complement').val(phoneNumber);
      }
    }, TIMEOUT_500);
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
