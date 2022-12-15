import DeliverContainer from '../partials/Deliver/DeliverContainer';
import ExtraFieldsContainer from '../partials/Deliver/ExtraFieldsContainer';
import {
  parseAttribute,
  populateAddressForm,
  setAddress,
  submitAddressForm,
  submitDeliveryForm,
} from '../partials/Deliver/utils';
import { STEPS } from '../utils/const';
import { getSpecialCategories } from '../utils/functions';
import { getAddressByName } from '../utils/services';

const DeliverController = (() => {
  const state = {
    view: 'list',
    hasFurn: false,
    hasTVs: false,
    hasSim: false,
  };

  const addShippingMethod = () => {
    $('#delivery-packages-options').clone().appendTo('#bash-delivery-options');
  };

  const setupDeliver = () => {
    if ($('#bash--delivery-container').length) return;

    if (window.vtexjs.checkout.orderForm) {
      const { items } = window.vtexjs.checkout.orderForm;
      const { hasFurniture, hasTVs, hasSimCards } = getSpecialCategories(items);

      state.hasFurn = hasFurniture;
      state.hasTVs = hasTVs;
      state.hasSim = hasSimCards;
    }
    $('#postalCode-finished-loading').after(
      DeliverContainer({
        hasFurn: state.hasFurn,
      })
    );
    const showExtraFields = state.hasFurn || state.hasSim || state.hasTVs;

    if (showExtraFields) {
      $('#bash-delivery-options').before(
        ExtraFieldsContainer({
          hasFurn: state.hasFurn,
          hasSim: state.hasSim,
          hasTV: state.hasTVs,
        })
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
      $('.bash--delivery-container.hide').removeClass('hide');
    } else if ($('.bash--delivery-container:not(.hide)').length) {
      $('.bash--delivery-container:not(.hide)').addClass('hide');
    }
  });

  // Change view
  $(document).on('click', 'a[data-view]', function (e) {
    e.preventDefault();
    const viewTarget = $(this).data('view');
    const content = decodeURIComponent($(this).data('content'));
    window.postMessage({ action: 'setDeliveryView', view: viewTarget, content });
  });

  // Select address
  $(document).on('change', 'input[type="radio"][name="selected-address"]', function () {
    const address = parseAttribute($(this).parents('.bash--address-listing').data('address'));

    if (document.forms['bash--delivery-form']) {
      document.forms['bash--delivery-form'].reset();
      document.forms['bash--delivery-form'].classList.remove('show-form-errors');
    }

    getAddressByName(address.addressName).then((addressByName) => {
      setAddress(addressByName || address, { validateExtraFields: false });
      $('input[type="radio"][name="selected-address"]:checked').attr('checked', false);
      $(this).attr('checked', true);
    });
  });

  $(document).on('submit', '#bash--address-form', submitAddressForm);
  $(document).on('submit', '#bash--delivery-form', submitDeliveryForm);

  // Form validation
  window.addEventListener('message', (event) => {
    const { data } = event;
    if (!data || !data.action) return;

    switch (data.action) {
      case 'setDeliveryView':
        document.querySelector('.bash--delivery-container').setAttribute('data-view', data.view);
        if (data.view === 'address-form') {
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

  // Clear local checkout DB on ext.
  // window.addEventListener('beforeunload', clearAddresses);

  return {
    state,
    init: () => {},
  };
})();
export default DeliverController;
