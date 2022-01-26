import CartController from './CartController';
import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAMsg: false,
    showMixedProductsMsg: false
  };

  const config = {
    furnitureId: '1',
    tvId: '1',
    simCardId: '1',
    buildingType: ['Free standing', 'House in complex', 'Townhouse', 'Apartment'],
    parkingDistance: [15, 25, 50, 100],
    deliveryFloor: ['1', '2', '3+'],
    liftStairs: ['lift', 'stairs'],
    RICAMsg: 'You can\'t collect this order in store because your cart contains items which '
      + 'require either RICA or TV License validation.',
    MixedProductsMsg: 'We\'ll ship your furniture and other items in your cart to the selected address. '
      + 'Only the furniture delivery fee will apply.'
  };

  const checkCartCategories = () => {
    const { categories } = CartController.state;
    console.log('CartController', categories);
  };

  $(document).ready(() => {
    if (typeof (setAppConfiguration) !== 'undefined' && window.location.hash === STEPS.SHIPPING) {
      // eslint-disable-next-line no-undef
      setAppConfiguration(config);
    }
  });

  $(window).on('hashchange', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        checkCartCategories();
      }, ORDERFORM_TIMEOUT);
    }
  });

  $(window).on('orderFormUpdated.vtex', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        checkCartCategories();
      }, ORDERFORM_TIMEOUT);
    }
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
