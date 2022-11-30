import { FurnitureForm, MixedProducts, RICAForm, TVIDForm, TVorRICAMsg } from '../partials';
import { AD_TYPE, FURNITURE_FEE_LINK, RICA_APP, STEPS, TIMEOUT_500, TIMEOUT_750 } from '../utils/const';
import {
  addBorderTop,
  checkoutGetCustomData,
  getShippingData,
  getSpecialCategories,
  setMasterdataFields,
  setRicaFields,
  waitAndResetLocalStorage,
} from '../utils/functions';
import CartController from './CartController';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAForm: false,
    showTVorRICAMsg: false,
    showMixedProductsMsg: false,
    runningObserver: false,
  };

  const checkCartCategories = () => {
    if (window.vtexjs.checkout.orderForm) {
      const { items } = window.vtexjs.checkout.orderForm;
      const { furniture, TVs, SimCards, categories } = getSpecialCategories(items);
      const { config } = CartController;
      state.showFurnitureForm = furniture;
      state.showTVIDForm = TVs;
      state.showRICAForm = SimCards;
      state.showTVorRICAMsg = state.showTVIDForm || state.showRICAForm;
      /**
        Conditions to show mixed products alert:
        - more than one item
        - after filter categories, this array includes at least one furniture id
        - there are only one category OR not all the categories in the array are furniture
      */
      state.showMixedProductsMsg =
        items.length > 1 && furniture && !categories.every((value) => value === config.furnitureId);
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
      const fields =
        '?_fields=buildingType,parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace' +
        ',assembleFurniture,tvID';

      const customShippingInfo = await getShippingData(addressId, fields);

      if (customShippingInfo) {
        let furnitureCompleted = false;
        let tvCompleted = false;

        if (
          state.showFurnitureForm &&
          customShippingInfo.buildingType &&
          customShippingInfo.deliveryFloor &&
          customShippingInfo.parkingDistance
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

    if (
      ricaFields &&
      ricaFields.idOrPassport &&
      ricaFields.fullName &&
      ricaFields.streetAddress &&
      ricaFields.suburb &&
      ricaFields.city &&
      ricaFields.postalCode &&
      ricaFields.province
    ) {
      validData = true;
    }

    return validData;
  };

  const setDataInCustomFields = async () => {
    if (window.vtexjs.checkout.orderForm) {
      const { address } = window.vtexjs.checkout.orderForm.shippingData;
      const { showFurnitureForm, showRICAForm, showTVIDForm } = ViewController.state;

      if (showRICAForm) {
        setRicaFields();
      }

      if (address) {
        await setMasterdataFields(showFurnitureForm, showTVIDForm);
      }
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
        const address = window.vtexjs.checkout?.orderForm?.shippingData?.address;

        if (address && address.addressType === AD_TYPE.DELIVERY) {
          if (window.location.hash === STEPS.SHIPPING) {
            setTimeout(() => {
              showCustomSections();
              setDataInCustomFields();
            }, TIMEOUT_750);

            // eslint-disable-next-line no-use-before-define
            runViewObserver();
          } else if (window.location.hash === STEPS.PAYMENT) {
            setTimeout(async () => {
              let isDataCompleted = localStorage.getItem('shippingDataCompleted');

              if (isDataCompleted) {
                waitAndResetLocalStorage();
              } else if (state.showFurnitureForm || state.showRICAForm || state.showTVIDForm) {
                if (state.showRICAForm) {
                  isDataCompleted = ricaFieldsCompleted();
                }
                if (state.showFurnitureForm || state.showTVIDForm) {
                  isDataCompleted = await shippingCustomDataCompleted();
                }

                if (!isDataCompleted) {
                  window.location.hash = STEPS.SHIPPING;
                }
              }
            }, 1750);
          }
        }
      }, TIMEOUT_750);
    }
  };

  const setView = (view) => {
    document.body.setAttribute('data-delivery-view', view);
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  $(document).on('click', '#shipping-data .btn-link.vtex-omnishipping-1-x-btnDelivery', () => {
    runCustomization();
  });

  const runViewObserver = () => {
    if (state.runningObserver) return;

    const elementToObserveChange = document.querySelector('.shipping-container .box-step');
    const observerConfig = { attributes: false, childList: true, characterData: false };
    const observer = new MutationObserver(() => {
      state.runningObserver = true;
      if (window.location.hash === STEPS.SHIPPING) {
        runCustomization();
      }
    });

    if (elementToObserveChange) {
      observer.observe(elementToObserveChange, observerConfig);
    }
  };

  const publicInit = () => {};

  return {
    init: publicInit,
    state,
    setView,
    setDataInCustomFields,
  };
})();

export default ViewController;
