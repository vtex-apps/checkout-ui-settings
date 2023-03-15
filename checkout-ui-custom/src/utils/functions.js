import { FURNITURE_CAT, RICA_APP, SIM_CAT, TV_CAT } from './const';
import { validatePhoneNumber } from './phoneFields';

// Functions to manage CustomData
const checkoutGetCustomData = (appId) => {
  const { customData } = window.vtexjs.checkout.orderForm;
  let fields = {};

  if (customData && customData.customApps && customData.customApps.length > 0) {
    customData.customApps.forEach((app) => {
      if (app.id === appId) {
        fields = app.fields;
      }
    });
  }

  return fields;
};

const checkoutSendCustomData = (appId, customData) => {
  const { orderFormId } = window.vtexjs.checkout.orderForm;

  return $.ajax({
    type: 'PUT',
    url: `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}`,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(customData),
  });
};

const setRicaFields = (getDataFrom = 'customApps') => {
  let ricaFields;

  if (getDataFrom === 'shippingAddress') {
    const { address } = window.vtexjs.checkout.orderForm.shippingData;

    ricaFields = {
      idOrPassport: '',
      sameAddress: 'true',
      fullName: address.receiverName || $('#ship-receiverName').val(),
      streetAddress: `${address.street}, ${address.number}`,
      suburb: address.neighborhood,
      city: address.city,
      postalCode: address.postalCode,
      province: address.state,
    };
  } else if (getDataFrom === 'customApps') {
    ricaFields = checkoutGetCustomData(RICA_APP);
  }

  if (ricaFields && !jQuery.isEmptyObject(ricaFields)) {
    if (getDataFrom === 'customApps') {
      $('#tfg-rica-id-passport').val(ricaFields.idOrPassport);
      $('#tfg-rica-same-address').prop('checked', ricaFields.sameAddress === 'true');
    }
    $('#tfg-rica-fullname').val(ricaFields.fullName);
    $('#tfg-rica-street').val(ricaFields.streetAddress);
    $('#tfg-rica-suburb').val(ricaFields.suburb);
    $('#tfg-rica-city').val(ricaFields.city);
    $('#tfg-rica-postal-code').val(ricaFields.postalCode);
    $('#tfg-rica-province').val(ricaFields.province);
  }
};

// Random Functions
const addBorderTop = (elementClass) => {
  $(elementClass).addClass('custom-step-border');
  $(elementClass).last().addClass('last-custom-step-border');
};

const waitAndResetLocalStorage = () => {
  setTimeout(() => {
    localStorage.removeItem('shippingDataCompleted');
  }, 5000);
};

const isValidNumberBash = (tel) => validatePhoneNumber(tel);

const getSpecialCategories = (items) => {
  const furnitureCategories = [FURNITURE_CAT];
  const tvCategories = [TV_CAT];
  const simCardCategories = [SIM_CAT];
  const categories = [];
  let hasTVs = false;
  let hasSimCards = false;
  let hasFurniture = false;
  let hasFurnitureMixed = false;

  items.forEach((item) => {
    const itemCategories = item.productCategoryIds.split('/');
    categories.push(itemCategories);
    itemCategories.forEach((category) => {
      if (!category) return;
      if (tvCategories.includes(category)) hasTVs = true;
      if (simCardCategories.includes(category)) hasSimCards = true;
      if (furnitureCategories.includes(category)) hasFurniture = true;
    });
  });

  hasFurnitureMixed = items.length > 1 && hasFurniture && !categories.every((c) => c === FURNITURE_CAT);

  return {
    hasFurniture,
    hasSimCards,
    hasTVs,
    hasFurnitureMixed,
    categories,
  };
};

export const clearLoaders = () => {
  ('happened');

  $('.shimmer').removeClass('shimmer');
};

export const showBusinessName = ({ focus = false }) => {
  $('.bash--textfield-businessName')
    .removeClass('optional')
    .slideDown(() => {
      $('#bash--input-businessName').attr('required', 'required');
      if (!$('#bash--input-businessName').val() && focus) $('#bash--input-businessName')?.focus();
    });
};

export const hideBusinessName = () => {
  $('.bash--textfield-businessName').addClass('optional').slideUp();
  $('#bash--input-businessName').removeAttr('required');
};

export const scrollToInvalidField = () => {
  const invalidInputs = Array.from($('form.form-step.box-edit > :invalid, .error'));
  // sort inputs by offset from top of viewport
  // to handle elements that may be invalid but
  // aren't necessarily highest on the page
  invalidInputs.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  invalidInputs[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
};

export {
  addBorderTop,
  waitAndResetLocalStorage,
  checkoutGetCustomData,
  checkoutSendCustomData,
  setRicaFields,
  isValidNumberBash,
  getSpecialCategories,
};

