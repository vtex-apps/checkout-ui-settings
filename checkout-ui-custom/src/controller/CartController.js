/* eslint-disable no-undef */
import { STEPS, ORDERFORM_TIMEOUT } from '../utils/const';

const CartController = (() => {
  const state = {
    categories: {}
  };

  const getCategories = (items) => {
    const categories = {};

    items.forEach((item) => {
      Object.assign(categories, item.productCategories);
    });

    return categories;
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING || window.location.hash === STEPS.PAYMENT) {
      setTimeout(() => {
        if (vtexjs.checkout.orderForm) {
          const { items } = vtexjs.checkout.orderForm;
          state.categories = {
            ...getCategories(items)
          };
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

export default CartController;
