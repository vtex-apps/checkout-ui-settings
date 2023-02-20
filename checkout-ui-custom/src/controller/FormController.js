/* eslint-disable func-names */
import { STEPS } from '../utils/const';

const FormController = (() => {
  const state = {
    validForm: true,
    runningObserver: false,
  };

  const runCustomization = () => {
    if (window.location.hash === STEPS.SHIPPING) {
      if ($('.shipping-summary-info').length && $('.shipping-summary-info').text() === 'Waiting for more information') {
        window.location.hash = STEPS.PROFILE;
      }
    }
  };

  // EVENT SUBSCRIPTION

  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange', () => {
    runCustomization();
    if (window.location.hash === STEPS.SHIPPING) {
      setTimeout(() => {
        document.getElementById('shipping-data').scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  });

  $(window).on('orderFormUpdated.vtex', () => {
    runCustomization();
  });

  return {
    state,
    init: () => {},
  };
})();

export default FormController;
