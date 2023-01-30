import { MixedProducts, TVorRICAMsg } from '../partials';
import { FURNITURE_CAT, TIMEOUT_500 } from '../utils/const';
import { addBorderTop, getSpecialCategories } from '../utils/functions';

const ViewController = (() => {
  const state = {
    showFurnitureForm: false,
    showTVIDForm: false,
    showRICAForm: false,
    showTVorRICAMsg: false,
    showMixedProductsMsg: false,
    runningObserver: false,
  };

  const checkCartCategories = () => {
    if (window.vtexjs.checkout.orderForm) {
      const { items } = window.vtexjs.checkout.orderForm;
      const { hasFurniture, hasTVs, hasSimCards, categories } = getSpecialCategories(items);
      state.showTVIDForm = hasTVs;
      state.showRICAForm = hasSimCards;
      state.showTVorRICAMsg = state.showTVIDForm || state.showRICAForm;
      /**
        Conditions to show mixed products alert:
        - more than one item
        - after filter categories, this array includes at least one furniture id
        - there are only one category OR not all the categories in the array are furniture
      */
      state.showMixedProductsMsg = items.length > 1 && hasFurniture && !categories.every((c) => c === FURNITURE_CAT);
    }
  };

  const showCustomSections = () => {
    const tvOrRICAMsgStepExists = $('#tfg-custom-tvrica-msg').length > 0;
    const mixedProductsMsgExits = $('#tfg-custom-mixed-msg').length > 0;

    let addBorder = false;

    if (state.showTVorRICAMsg || state.showMixedProductsMsg) {
      if ($('.vtex-omnishipping-1-x-deliveryChannelsWrapper.custom-disabled').length < 1) {
        $('#shipping-option-delivery').trigger('click');
        $('.vtex-omnishipping-1-x-deliveryChannelsWrapper').addClass('custom-disabled');
      }

      if (state.showTVorRICAMsg && !tvOrRICAMsgStepExists) {
        $('.vtex-omnishipping-1-x-addressFormPart1').prepend(TVorRICAMsg());
        addBorder = true;
      }

      if (state.showMixedProductsMsg && !mixedProductsMsgExits) {
        $('.vtex-omnishipping-1-x-addressFormPart1').prepend(MixedProducts());
        addBorder = true;
      }
    }

    if (addBorder) addBorderTop('.tfg-custom-step');
  };

  const runCustomization = () => {
    /* Hiding subheader when there is furniture in cart */
    setTimeout(() => {
      checkCartCategories();

      if (state.showFurnitureForm) {
        $('div.subheader').css('display', 'none');
      } else {
        $('div.subheader').css('display', 'block');
      }
    }, TIMEOUT_500);
  };

  const setView = (view) => {
    document.body.setAttribute('data-delivery-view', view);
  };

  // EVENTS SUBSCRIPTION
  $(document).ready(() => {
    runCustomization();
  });

  $(window).on('hashchange orderFormUpdated.vtex', () => {
    runCustomization();
  });

  $(document).on('click', '#shipping-data .btn-link.vtex-omnishipping-1-x-btnDelivery', () => {
    runCustomization();
  });

  return {
    state,
    setView,
    showCustomSections,
    init: () => {},
  };
})();

export default ViewController;
