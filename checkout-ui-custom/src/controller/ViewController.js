import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';
import {
  FurnitureForm,
  TVorRICAMsg,
  TVIDForm,
  RICAMsg
} from '../templates';
import CartController from './CartController';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAMsg: false,
    showTVorRICAMsg: false,
    showMixedCategoriesMsg: false
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
    state.showMixedCategoriesMsg = (
      allCategoriesIds.includes(config.furnitureId)
      && !allCategoriesIds.every((value) => value === config.furnitureId)
    );
  };

  const addBorderTop = () => {
    if ($('.tfg-custom-step').length > 1) {
      $('.tfg-custom-step, .vtex-omnishipping-1-x-shippingSectionTitle').addClass('custom-step-border');
    }
  };

  const showCustomSections = () => {
    const tvRICAStepExists = ($('#tfg-custom-rica-msg').length > 0);
    const tvIDStepExists = ($('#tfg-custom-tvid-step').length > 0);
    const furnitureStepExists = ($('#tfg-custom-furniture-step').length > 0);
    const tvOrRICAMsgStepExists = ($('#tfg-custom-tvrica-msg').length > 0);

    if (state.showRICAMsg && !tvRICAStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(RICAMsg());
    }

    if (state.showTVIDForm && !tvIDStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(TVIDForm());
    }

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(FurnitureForm(config.furnitureForm));
    }

    if (state.showTVorRICAMsg && !tvOrRICAMsgStepExists) {
      $('#shipping-option-delivery').trigger('click');
      $('.vtex-omnishipping-1-x-deliveryChannelsWrapper').addClass('custom-disabled');
      $('.vtex-omnishipping-1-x-addressFormPart1').prepend(TVorRICAMsg(config.TVorRICAMsg));
    }

    addBorderTop();
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      if (typeof (setAppConfiguration) !== 'undefined' && window.location.hash === STEPS.SHIPPING) {
        // eslint-disable-next-line no-undef
        setAppConfiguration(config);
      }

      setTimeout(() => {
        checkCartCategories();
        showCustomSections();
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
