import {
  STEPS,
  ORDERFORM_TIMEOUT,
  FURNITURE_FEES
} from '../utils/const';
import {
  getShippingData,
  addBorderTop,
  waitAndResetLocalStorage
} from '../utils/functions';
import {
  FurnitureForm,
  TVorRICAMsg,
  TVIDForm,
  RICAMsg,
  MixedProducts
} from '../templates';
import CartController from './CartController';

const FURNITURE_FEE_LINK = `<a href="${FURNITURE_FEES}" class="furniture-fees-link"`
  + 'target="_blank">Furniture delivery costs</a>';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAMsg: false,
    showTVorRICAMsg: false,
    showMixedProductsMsg: false
  };

  const checkCartCategories = () => {
    const { items } = vtexjs.checkout.orderForm;
    const { categories } = CartController.state;
    const { config } = CartController;

    state.showFurnitureForm = categories.includes(config.furnitureId);
    state.showTVIDForm = categories.includes(config.tvId);
    state.showRICAMsg = categories.includes(config.simCardId);
    state.showTVorRICAMsg = state.showTVIDForm || state.showRICAMsg;
    /**
      Conditions to show mixed products alert:
      - more than one item
      - after filter categories, this array includes at least one furniture id
      - there are only one category OR not all the categories in the array are furniture
    */
    state.showMixedProductsMsg = (
      items.length > 1
      && categories.includes(config.furnitureId)
      && (categories.length === 1 || !categories.every((value) => value === config.furnitureId))
    );
  };

  const showCustomSections = () => {
    const { config } = CartController;

    const tvRICAStepExists = ($('#tfg-custom-rica-msg').length > 0);
    const tvIDStepExists = ($('#tfg-custom-tvid-step').length > 0);
    const furnitureStepExists = ($('#tfg-custom-furniture-step').length > 0);
    const tvOrRICAMsgStepExists = ($('#tfg-custom-tvrica-msg').length > 0);
    const mixedProductsMsgExits = ($('#tfg-custom-mixed-msg').length > 0);

    if (state.showRICAMsg && !tvRICAStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(RICAMsg());
    }

    if (state.showTVIDForm && !tvIDStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(TVIDForm());
    }

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(FurnitureForm(config.furnitureForm));
      $('.vtex-omnishipping-1-x-deliveryGroup p.vtex-omnishipping-1-x-shippingSectionTitle').append(FURNITURE_FEE_LINK);
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

    if (vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.shippingData.address) {
      const { addressId } = vtexjs.checkout.orderForm.shippingData.address;
      const fields = '?_fields=companyBuilding,furnitureReady,buildingType,parkingDistance,'
        + 'deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';

      const customShippingInfo = await getShippingData(addressId, fields);

      if (customShippingInfo) {
        let furnitureCompleted = false;
        let tvCompleted = false;

        if (state.showFurnitureForm
          && customShippingInfo.buildingType
          && customShippingInfo.deliveryFloor
          && customShippingInfo.parkingDistance) {
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

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING || window.location.hash === STEPS.PAYMENT) {
      setTimeout(() => {
        checkCartCategories();

        if (window.location.hash === STEPS.SHIPPING) {
          showCustomSections();

          // This button has a bug an needs to be clicked in two times; I trigger once to improve UX
          if ($('button.vtex-omnishipping-1-x-btnDelivery').length > 0) {
            $('button.vtex-omnishipping-1-x-btnDelivery').trigger('click');
          }
        } else if (window.location.hash === STEPS.PAYMENT) {
          let isDataCompleted = localStorage.getItem('shippingDataCompleted');

          if (!isDataCompleted) {
            setTimeout(async () => {
              isDataCompleted = await shippingCustomDataCompleted();

              if ((state.showFurnitureForm || state.showTVIDForm) && !isDataCompleted) {
                window.location.hash = STEPS.SHIPPING;
              }
            }, 750);
          } else {
            waitAndResetLocalStorage();
          }
        }
      }, ORDERFORM_TIMEOUT);
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  const publicInit = () => { };

  return {
    init: publicInit,
    state
  };
})();

export default ViewController;
