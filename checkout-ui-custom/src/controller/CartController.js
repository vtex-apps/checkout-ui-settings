/* eslint-disable no-undef */
import { STEPS, TIMEOUT_500 } from '../utils/const';

const CartController = (() => {
  const state = {
    categories: {}
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

  const getCategories = (items) => {
    const categoriesToCheck = [config.furnitureId, config.tvId, config.simCardId];
    const categories = [];

    items.forEach((item) => {
      const itemCategories = item.productCategoryIds.split('/');
      itemCategories.forEach((category) => {
        if (category && categoriesToCheck.includes(category)) {
          categories.push(category);
        }
      });
    });

    state.categories = categories;
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING || window.location.hash === STEPS.PAYMENT) {
      if (typeof (setAppConfiguration) !== 'undefined') {
        // eslint-disable-next-line no-undef
        setAppConfiguration(config);
      }

      setTimeout(() => {
        if (vtexjs.checkout.orderForm) {
          const { items } = vtexjs.checkout.orderForm;
          getCategories(items);
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

  const publicInit = () => { };

  return {
    init: publicInit,
    state,
    config
  };
})();

export default CartController;
