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

  $(window).on('hashchange', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const { items } = vtexjs.checkout.orderForm;
        state.categories = {
          ...getCategories(items)
        };
      }, ORDERFORM_TIMEOUT);
    }
  });

  $(window).on('orderFormUpdated.vtex', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        const { items } = vtexjs.checkout.orderForm;
        state.categories = {
          ...getCategories(items)
        };
      }, ORDERFORM_TIMEOUT);
    }
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
