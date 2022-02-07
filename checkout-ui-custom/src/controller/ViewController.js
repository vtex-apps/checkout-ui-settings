import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';
import {
  FurnitureForm,
  TVorRICAMsg
} from '../templates';
import CartController from './CartController';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
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

  const restartState = () => {
    state.showFurnitureForm = false;
    state.showTVIDForm = false;
    state.showTVorRICAMsg = false;
    state.showMixedCategoriesMsg = false;
  };

  const checkCartCategories = () => {
    const { categories } = CartController.state;
    const allCategoriesIds = Object.keys(categories);

    state.showFurnitureForm = allCategoriesIds.includes(config.furnitureId);
    state.showTVIDForm = allCategoriesIds.includes(config.tvId);
    state.showTVorRICAMsg = state.showTVIDForm || allCategoriesIds.includes(config.simCardId);
    state.showMixedCategoriesMsg = (
      allCategoriesIds.includes(config.furnitureId)
      && !allCategoriesIds.every((value) => value === config.furnitureId)
    );

    console.log('## state', state);
  };

  const showCustomSections = () => {
    const furnitureStepExists = ($('#tfg-custom-furniture-step').length > 0);
    const tvOrRICAMsgStepExists = ($('#tfg-custom-tvrica-msg').length > 0);

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(FurnitureForm(config.furnitureForm));
    }

    if (state.showTVorRICAMsg && !tvOrRICAMsgStepExists) {
      setTimeout(() => {
        $('#shipping-option-delivery').trigger('click');
        $('.vtex-omnishipping-1-x-deliveryChannelsWrapper').addClass('custom-disabled');
        $('.vtex-omnishipping-1-x-addressFormPart1').prepend(TVorRICAMsg(config.TVorRICAMsg));
      }, ORDERFORM_TIMEOUT);
    }
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      restartState();

      setTimeout(() => {
        checkCartCategories();
        showCustomSections();
      }, ORDERFORM_TIMEOUT);
    }
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    if (typeof (setAppConfiguration) !== 'undefined' && window.location.hash === STEPS.SHIPPING) {
      // eslint-disable-next-line no-undef
      setAppConfiguration(config);
    }

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
