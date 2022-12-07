import DeliverContainer from '../partials/Deliver/DeliverContainer';
import { STEPS } from '../utils/const';

const DeliverController = (() => {
  const state = {
    view: 'list', // list, addNew, add, edit, complete, selected
  };

  const setupDeliver = () => {
    if ($('#bash--deliver-container').length) return;
    $('#postalCode-finished-loading').after(DeliverContainer());
  };

  $(window).on('hashchange', () => {
    if (window.location.hash === STEPS.SHIPPING) {
      console.info('Hash change');
      setupDeliver();
    }
  });

  // {
  //   action: "setDeliverView",
  //   view: "select-address"
  // }

  $(document).on('click', 'a[data-view]', function (e) {
    e.preventDefault();
    const viewTarget = $(this).data('view');
    window.postMessage({ action: 'setDeliveryView', view: viewTarget });
  });

  window.addEventListener('message', (event) => {
    const { data } = event;
    if (!data || !data.action) return;

    switch (data.action) {
      case 'setDeliveryView':
        document.querySelector('.bash--delivery-container').setAttribute('data-view', data.view);

        break;
      default:
        console.error('Unknown action', data.action);
    }
  });

  return {
    state,
    init: () => {},
  };
})();
export default DeliverController;
