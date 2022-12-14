import DeliverContainer from '../partials/Deliver/DeliverContainer';
import ExtraFieldsContainer from '../partials/Deliver/ExtraFieldsContainer';
import { parseAttribute, populateAddressForm, setAddress } from '../partials/Deliver/utils';
import { STEPS } from '../utils/const';
import { getSpecialCategories } from '../utils/functions';

const DeliverController = (() => {
  const state = {
    view: 'list', // list, addNew, add, edit, complete, selected
    hasFurn: false,
    hasTVs: false,
    hasSim: false,
  };

  const addShippingMethod = () => {
    $('#delivery-packages-options').clone().appendTo('.shipping-method');
  };

  const setupDeliver = () => {
    if ($('#bash--deliver-container').length) return;
    if (window.vtexjs.checkout.orderForm) {
      const { items } = window.vtexjs.checkout.orderForm;
      const { hasFurniture, hasTVs, hasSimCards } = getSpecialCategories(items);

      state.hasFurn = hasFurniture;
      state.hasTVs = hasTVs;
      state.hasSim = hasSimCards;
    }
    $('#postalCode-finished-loading').after(DeliverContainer({
      hasFurn: state.hasFurn,
    }));
    const showExtraFields = state.hasFurn || state.hasSim || state.hasTVs;

    if (showExtraFields) {
      $('div.bash--delivery-container > section.shipping-method').before(
        ExtraFieldsContainer({
          hasFurn: state.hasFurn,
          hasSim: state.hasSim,
          hasTV: state.hasTVs,
        }),
      );
    }
    addShippingMethod();

    // Form validation
    $('select, input').off('invalid');
    $('select, input')
      .on('invalid', function () {
        $(this[0]).parents('form').addClass('show-form-errors');
        $(this)[0].setCustomValidity(' ');
      })
      .on('change keyUp', function () {
        $(this)[0].setCustomValidity('');
      });
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
    const address = parseAttribute($(`#address-${this.value}`).data('address'));
    setAddress(address);
  });

  // Form validation
  window.addEventListener('message', (event) => {
    const { data } = event;
    if (!data || !data.action) return;

    switch (data.action) {
      case 'setDeliveryView':
        document.querySelector('.bash--delivery-container').setAttribute('data-view', data.view);

        if (data.view === 'address-form') {
          // init form validation.

          if (data.content) {
            const address = JSON.parse(decodeURIComponent($(`#${data.content}`).data('address')));
            populateAddressForm(address);
          }
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
