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
    if (window.location.hash === STEPS.SHIPPING) {
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

  const publicInit = () => {
    window.CartController = this;
  };

  return {
    init: publicInit,
    state
  };
})();

export default CartController;
