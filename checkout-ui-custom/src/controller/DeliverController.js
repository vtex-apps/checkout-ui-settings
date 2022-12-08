import DeliverContainer from '../partials/Deliver/DeliverContainer';
import { parseAttribute, populateAddressForm, setAddress } from '../partials/Deliver/utils';
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

  // Change view
  $(document).on('click', 'a[data-view]', function (e) {
    e.preventDefault();
    const viewTarget = $(this).data('view');
    const content = decodeURIComponent($(this).data('content'));
    window.postMessage({ action: 'setDeliveryView', view: viewTarget, content });
  });

  // Select address
  $(document).on('change', 'input[type="radio"][name="selected-address"]', function () {
    console.info({ newAddress: this.value });

    const address = parseAttribute($(`#address-${this.value}`).data('address'));

    setAddress(address);
  });

  window.addEventListener('message', (event) => {
    const { data } = event;
    if (!data || !data.action) return;

    switch (data.action) {
      case 'setDeliveryView':
        document.querySelector('.bash--delivery-container').setAttribute('data-view', data.view);

        if (data.view === 'address-form' && data.content) {
          const address = JSON.parse(decodeURIComponent($(`#${data.content}`).data('address')));
          populateAddressForm(address);
        }

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
