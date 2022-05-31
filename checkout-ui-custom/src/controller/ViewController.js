import intlTelInput from 'intl-tel-input';
import utilsScript from 'intl-tel-input/build/js/utils';
import {
  STEPS,
  TIMEOUT_500,
  TIMEOUT_750,
  RICA_APP,
  FURNITURE_FEES,
  COUNTRIES_AVAILABLES,
  COUNTRIES
} from '../utils/const';
import { getShippingData, addBorderTop, waitAndResetLocalStorage, checkoutGetCustomData } from '../utils/functions';
import {
  FurnitureForm,
  TVorRICAMsg,
  TVIDForm,
  RICAForm,
  MixedProducts,
  AddressForm,
  SuburbField
} from '../templates';
import CartController from './CartController';
import 'intl-tel-input/build/css/intlTelInput.css';

const FURNITURE_FEE_LINK = `<a href="${FURNITURE_FEES}" class="furniture-fees-link"`
  + 'target="_blank">Furniture delivery costs</a>';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAForm: false,
    showTVorRICAMsg: false,
    showMixedProductsMsg: false,
    intTelInput: {},
    captureGoogleInputOnChange: false,
    captureAddressListOnChange: false
  };

  const checkCartCategories = () => {
    if (window.vtexjs.checkout.orderForm) {
      const { items } = window.vtexjs.checkout.orderForm;
      const { categories } = CartController.state;
      const { config } = CartController;

      state.showFurnitureForm = categories.includes(config.furnitureId);
      state.showTVIDForm = categories.includes(config.tvId);
      state.showRICAForm = categories.includes(config.simCardId);
      state.showTVorRICAMsg = state.showTVIDForm || state.showRICAForm;
      /**
        Conditions to show mixed products alert:
        - more than one item
        - after filter categories, this array includes at least one furniture id
        - there are only one category OR not all the categories in the array are furniture
      */
      state.showMixedProductsMsg = items.length > 1
        && categories.includes(config.furnitureId)
        && (categories.length === 1 || !categories.every((value) => value === config.furnitureId));
    }
  };

  const showCustomSections = () => {
    const { config } = CartController;

    const tvRICAStepExists = $('#tfg-custom-rica-msg').length > 0;
    const tvIDStepExists = $('#tfg-custom-tvid-step').length > 0;
    const furnitureStepExists = $('#tfg-custom-furniture-step').length > 0;
    const tvOrRICAMsgStepExists = $('#tfg-custom-tvrica-msg').length > 0;
    const mixedProductsMsgExits = $('#tfg-custom-mixed-msg').length > 0;

    if (state.showRICAForm && !tvRICAStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(RICAForm());
      $('#tfg-rica-same-address').trigger('change');
    }

    if (state.showTVIDForm && !tvIDStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(TVIDForm());
    }

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(FurnitureForm(config.furnitureForm));
      $('.vtex-omnishipping-1-x-deliveryGroup p.vtex-omnishipping-1-x-shippingSectionTitle').append(FURNITURE_FEE_LINK);
      $('div.subheader').css('display', 'none');
    }

    if (state.showTVorRICAMsg || state.showMixedProductsMsg) {
      $('#shipping-option-delivery').trigger('click');
      $('.vtex-omnishipping-1-x-deliveryChannelsWrapper').addClass('custom-disabled');

      if (state.showTVorRICAMsg && !tvOrRICAMsgStepExists) {
        $('.vtex-omnishipping-1-x-addressFormPart1').prepend(TVorRICAMsg(config.TVorRICAMsg));
      }

      if (state.showMixedProductsMsg && !mixedProductsMsgExits) {
        $('.vtex-omnishipping-1-x-addressFormPart1').prepend(MixedProducts(config.MixedProductsMsg));
      }
    }

    addBorderTop('.tfg-custom-step');
  };

  const shippingCustomDataCompleted = async () => {
    let validData = false;

    if (window.vtexjs.checkout.orderForm && window.vtexjs.checkout.orderForm.shippingData.address) {
      const { addressId } = window.vtexjs.checkout.orderForm.shippingData.address;
      const fields = '?_fields=companyBuilding,furnitureReady,buildingType,parkingDistance,'
        + 'deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';

      const customShippingInfo = await getShippingData(addressId, fields);

      console.log('!! shippingCustomDataCompleted - customShippingInfo', customShippingInfo);

      if (customShippingInfo) {
        let furnitureCompleted = false;
        let tvCompleted = false;

        if (
          state.showFurnitureForm
          && customShippingInfo.buildingType
          && customShippingInfo.deliveryFloor
          && customShippingInfo.parkingDistance
        ) {
          furnitureCompleted = true;
          validData = true;
        }

        if (state.showTVIDForm && customShippingInfo.tvID) {
          tvCompleted = true;
          validData = true;
        }

        if (state.showFurnitureForm && state.showTVIDForm && (!furnitureCompleted || !tvCompleted)) {
          validData = false;
        }
      }
    }

    return validData;
  };

  const ricaFieldsCompleted = () => {
    let validData = false;

    const ricaFields = checkoutGetCustomData(RICA_APP);

    console.log('!! ricaFieldsCompleted', ricaFields);

    if (
      ricaFields
      && ricaFields.idOrPassport
      && ricaFields.fullName
      && ricaFields.streetAddress
      && ricaFields.suburb
      && ricaFields.city
      && ricaFields.postalCode
      && ricaFields.province
    ) {
      validData = true;
    }

    return validData;
  };

  const isAddressFormCompleted = () => {
    const address = window.vtexjs.checkout?.orderForm?.shippingData?.address;
    console.log('!! isAddressFormCompleted - complement', address?.complement);
    console.log('!! isAddressFormCompleted - receiverName', address?.receiverName);
    console.log('!! isAddressFormCompleted - neighborhood', address?.neighborhood);
    return (address?.complement && address?.receiverName && address?.neighborhood);
  };

  const addAddressFormFields = () => {
    const setInputPhone = () => {
      const customPlaceholder = (_, selectedCountryData) => {
        $('.iti--allow-dropdown').attr('data-content', COUNTRIES[selectedCountryData.iso2].phonePlaceholder);
        return '';
      };

      const phoneInput = document.querySelector('.custom-field-complement input');
      if (phoneInput) {
        const iti = intlTelInput(phoneInput, {
          initialCountry: COUNTRIES.za.code,
          onlyCountries: COUNTRIES_AVAILABLES,
          customPlaceholder
        });

        state.intTelInput = iti;
      }
    };

    const saveCustomFieldAddress = () => {
      $('.tfg-custom-addressForm input').change((event) => {
        const field = event.target;
        const fieldName = field.getAttribute('field');
        const fields = JSON.parse(localStorage.getItem('custom-address-form-fields')) ?? {};

        fields[fieldName] = field.value;

        localStorage.setItem('custom-address-form-fields', JSON.stringify(fields));
      });
    };

    // Insert elements
    const isAddressFormFieldsAdded = !!$('.tfg-custom-addressForm').length;
    if (!isAddressFormFieldsAdded) {
      $('.vcustom--vtex-omnishipping-1-x-address form').prepend(AddressForm());
      $('.vcustom--vtex-omnishipping-1-x-address__state').prepend(SuburbField());
      setInputPhone();
      saveCustomFieldAddress();
    }
  };

  const setValueToReceiverAndComplement = () => {
    const fields = JSON.parse(localStorage.getItem('custom-address-form-fields')) ?? {};
    const { firstName, lastName, phone } = window.vtexjs.checkout.orderForm.clientProfileData;

    fields.receiverName = `${firstName} ${lastName}`;
    fields.complement = phone;

    $('#custom-field-receiverName').val(fields.receiverName).attr('value', fields.receiverName);
    $('#custom-field-complement').val(fields.complement).attr('value', fields.complement);
    $('#custom-field-complement').attr('placeholder', fields.complement || '');

    localStorage.setItem('custom-address-form-fields', JSON.stringify(fields));
  };

  const toggleGoogleInput = () => {
    if (!$('#v-custom-ship-street').val()) {
      $('.body-order-form #shipping-data .vcustom--vtex-omnishipping-1-x-address > div > form').toggleClass('google');
      const selector = `.custom-field-receiverName,
        .custom-field-complement, .custom-field-companyBuilding,
        .vcustom--vtex-omnishipping-1-x-address__state,
          .v-custom-ship-info, .btn-go-to-shipping-wrapper`;
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
        setValueToReceiverAndComplement();
      });
    }
  };

  const runCustomization = () => {
    /* Hiding subheader when there is furniture in cart */
    setTimeout(() => {
      checkCartCategories();

      if (state.showFurnitureForm) {
        $('div.subheader').css('display', 'none');
      } else {
        $('div.subheader').css('display', 'block');
      }
    }, TIMEOUT_500);

    /* Adding custom sections */
    if (window.location.hash === STEPS.SHIPPING || window.location.hash === STEPS.PAYMENT) {
      setTimeout(() => {
        if (window.location.hash === STEPS.SHIPPING) {
          console.log('!! SHIPPING STEP - STATE', state);
          showCustomSections();
          addAddressFormFields();
          toggleGoogleInput();

          // This button has a bug an needs to be clicked in two times; I trigger once to improve UX
          if ($('button.vtex-omnishipping-1-x-btnDelivery').length > 0) {
            $('button.vtex-omnishipping-1-x-btnDelivery').trigger('click');
          }
        } else if (window.location.hash === STEPS.PAYMENT) {
          const isAddressCompleted = isAddressFormCompleted();

          console.log('!! isAddressCompleted', isAddressCompleted);

          if (!isAddressCompleted) {
            window.location.hash = STEPS.SHIPPING;
            setTimeout(() => {
              const addressEditSelector = $('.vtex-omnishipping-1-x-buttonEditAddress').length > 0
                ? $('.vtex-omnishipping-1-x-buttonEditAddress')
                : $('.vtex-omnishipping-1-x-linkEdit');
              addressEditSelector.trigger('click');
              /* Hay que dar un tiempo a VTEX para completar los campos y que estos no aparezcan con error */
              setTimeout(() => {
                $('#custom-btn-go-to-shippping-method').trigger('click');
              }, TIMEOUT_750);
            }, TIMEOUT_750);
          }

          console.log('!! state.showFurnitureForm', state.showFurnitureForm);
          console.log('!! state.showRICAForm', state.showRICAForm);
          console.log('!! state.showTVIDForm', state.showTVIDForm);

          if (state.showFurnitureForm || state.showRICAForm || state.showTVIDForm) {
            let isDataCompleted = localStorage.getItem('shippingDataCompleted');

            console.log('!! isDataCompleted', isDataCompleted);

            if (!isDataCompleted) {
              setTimeout(async () => {
                if (state.showRICAForm) {
                  isDataCompleted = ricaFieldsCompleted();
                }

                if (state.showFurnitureForm || state.showTVIDForm) {
                  isDataCompleted = await shippingCustomDataCompleted();
                }

                console.log('!! isDataCompleted', isDataCompleted);

                if (!isDataCompleted) {
                  window.location.hash = STEPS.SHIPPING;
                }
              }, TIMEOUT_750);
            } else {
              waitAndResetLocalStorage();
            }
          }
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

  $(document).on('click', '.vtex-omnishipping-1-x-addressList #new-address-button', () => {
    /* Empty custom fields for new address & set default values */
    $('.tfg-custom-addressForm input').val('').attr('value', '');
    setValueToReceiverAndComplement();
  });

  const publicInit = () => { };

  return {
    init: publicInit,
    state
  };
})();

export default ViewController;
