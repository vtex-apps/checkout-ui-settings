import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';
import FurnitureForm from '../templates/FurnitureForm';
import CartController from './CartController';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAMsg: false,
    showMixedCategoriesMsg: false
  };

  const config = {
    furnitureId: '1',
    tvId: '1',
    simCardId: '1',
    furnitureForm: {
      buildingType: ['Free standing', 'House in complex', 'Townhouse', 'Apartment'],
      parkingDistance: [15, 25, 50, 100],
      deliveryFloor: ['Ground', '1', '2', '3+'],
      liftStairs: ['Lift', 'Stairs']
    },
    RICAMsg: 'You can\'t collect this order in store because your cart contains items which '
      + 'require either RICA or TV License validation.',
    MixedProductsMsg: 'We\'ll ship your furniture and other items in your cart to the selected address. '
      + 'Only the furniture delivery fee will apply.'
  };

  const restartState = () => {
    state.showFurnitureForm = false;
    state.showTVIDForm = false;
    state.showRICAMsg = false;
    state.showMixedCategoriesMsg = false;
  };

  const hasMixedCategories = (furnitureId) => {
    const { categories } = CartController.state;
    const allCategoriesIds = Object.keys(categories);

    return (allCategoriesIds.includes(furnitureId) && !allCategoriesIds.includes(furnitureId));
  };

  const checkCartCategories = () => {
    const { categories } = CartController.state;

    Object.entries(categories).forEach((category) => {
      const [categoryId] = category[0];

      state.showFurnitureForm = !state.showFurnitureForm && config.furnitureId === categoryId;
      state.showTVIDForm = !state.showTVIDForm && config.tvId === categoryId;
      state.showRICAMsg = !state.showRICAMsg && config.simCardId === categoryId;
    });

    state.showMixedCategoriesMsg = hasMixedCategories(config.furnitureId);
  };

  const showCustomSections = () => {
    const furnitureStepExists = ($('#tfg-custom-furniture-step').length > 0);

    if (state.showFurnitureForm && !furnitureStepExists) {
      $('.vtex-omnishipping-1-x-deliveryGroup').prepend(FurnitureForm(config.furnitureForm));
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
