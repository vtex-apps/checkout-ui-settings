import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';
import {
  getCustomShippingData,
  getCustomShippingDataFromLS,
  addBorderTop
} from '../utils/functions';
import {
  FurnitureForm,
  TVorRICAMsg,
  TVIDForm,
  RICAMsg,
  MixedProducts
} from '../templates';
import CartController from './CartController';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAMsg: false,
    showTVorRICAMsg: false,
    showMixedProductsMsg: false
  };

  const config = {
    furnitureId: '0',
    tvId: '0',
    simCardId: '0',
    furnitureForm: {
      buildingType: ['Free standing', 'House in complex', 'Townhouse', 'Apartment'],
      parkingDistance: [15, 25, 50, 100],
      deliveryFloor: ['Ground', '1', '2', '3+'],
      liftStairs: ['Lift', 'Stairs']
    },
    TVorRICAMsg: 'You can\'t collect this order in store because your cart contains items which '
      + 'require either RICA or TV License validation.',
    MixedProductsMsg: 'We\'ll ship your furniture and other items in your cart to the selected address. '
      + 'Only the furniture delivery fee will apply.'
  };

  const checkCartCategories = () => {
    const { categories } = CartController.state;
    const allCategoriesIds = Object.keys(categories);

    state.showFurnitureForm = allCategoriesIds.includes(config.furnitureId);
    state.showTVIDForm = allCategoriesIds.includes(config.tvId);
    state.showRICAMsg = allCategoriesIds.includes(config.simCardId);
    state.showTVorRICAMsg = state.showTVIDForm || state.showRICAMsg;
    state.showMixedProductsMsg = (
      allCategoriesIds.includes(config.furnitureId)
      && !allCategoriesIds.every((value) => value === config.furnitureId)
    );
  };

  const showCustomSections = () => {
    const tvRICAStepExists = ($('#tfg-custom-rica-msg').length > 0);
    const tvIDStepExists = ($('#tfg-custom-tvid-step').length > 0);
    const furnitureStepExists = ($('#tfg-custom-furniture-step').length > 0);
    const tvOrRICAMsgStepExists = ($('#tfg-custom-tvrica-msg').length > 0);
    const mixedProductsMsgExits = ($('#tfg-custom-mixed-msg').length > 0);

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-address').append(FurnitureForm(config.furnitureForm));
    }

    if (state.showTVIDForm && !tvIDStepExists) {
      $('.vtex-omnishipping-1-x-address').append(TVIDForm());
    }

    if (state.showRICAMsg && !tvRICAStepExists) {
      $('.vtex-omnishipping-1-x-address').append(RICAMsg());
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

  const shippingCustomDataCompleted = () => {
    let validData = false;

    let customShippingInfo = getCustomShippingData();
    if (!customShippingInfo) {
      customShippingInfo = getCustomShippingDataFromLS();
    }

    console.log('customShippingInfo', customShippingInfo);

    if (customShippingInfo) {
      let furnitureCompleted = false;
      let tvCompleted = false;

      if (state.showFurnitureForm
        && customShippingInfo.assembleFurniture
        && customShippingInfo.buildingType
        && customShippingInfo.deliveryFloor
        && customShippingInfo.hasSufficientSpace
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

    return validData;
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING || window.location.hash === STEPS.PAYMENT) {
      if (typeof (setAppConfiguration) !== 'undefined') {
        // eslint-disable-next-line no-undef
        setAppConfiguration(config);
      }

      setTimeout(() => {
        checkCartCategories();

        if (window.location.hash === STEPS.SHIPPING) {
          showCustomSections();

          // This button has a bug an needs to be clicked in two times; I trigger one click for UX
          if ($('button.vtex-omnishipping-1-x-btnDelivery').length > 0) {
            $('button.vtex-omnishipping-1-x-btnDelivery').trigger('click');
          }
        } else if (window.location.hash === STEPS.PAYMENT) {
          setTimeout(() => {
            if ((state.showFurnitureForm || state.showTVIDForm) && !shippingCustomDataCompleted()) {
              window.location.hash = STEPS.SHIPPING;
            }
          }, 600);
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

  const publicInit = () => {
    window.ViewController = this;
  };

  return {
    init: publicInit,
    state
  };
})();

export default ViewController;
