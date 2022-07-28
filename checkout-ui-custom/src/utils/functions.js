/* eslint-disable import/prefer-default-export */
import { BASE_URL_API, RICA_APP } from './const';

// API Functions
const getHeadersByConfig = ({ cookie, cache, json }) => {
  const headers = new Headers();
  if (cookie) {
    headers.append('Cookie', document?.cookie);
  }
  if (cache) {
    headers.append('Cache-Control', 'no-cache');
  }
  if (json) {
    headers.append('Content-type', 'application/json');
  }
  return headers;
};

const getShippingData = async (addressName, fields) => {
  let data = {};

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: false });
  const options = {
    headers,
    credentials: 'include'
  };

  const response = await fetch(
    `${BASE_URL_API}masterdata/addresses/${fields}&_where=addressName=${addressName}&timestamp=${Date.now()}`,
    options
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (response && !response.error && response.data && response.data.length > 0) {
    [data] = response.data;
  }

  return data;
};

const saveAddress = async (fields = {}) => {
  let path;
  const { email } = window.vtexjs.checkout.orderForm.clientProfileData;
  const { address } = window.vtexjs.checkout.orderForm.shippingData;

  if (!address) return;

  // AD already exists (?)
  const savedAddress = address?.addressId ? await getShippingData(address.addressId, '?_fields=id') : {};

  // Guardado del nuevo addressType
  address.addressType = localStorage.getItem('addressType');

  if (savedAddress?.id) {
    path = `${BASE_URL_API}masterdata/address/${savedAddress.id}`;
  } else {
    path = `${BASE_URL_API}masterdata/addresses`;
  }

  // Importante respetar el orden de address para no sobreescribir receiver, complement y neighborhood
  const newAddress = {
    userId: email,
    ...address,
    ...fields
  };

  if (!savedAddress.id) {
    newAddress.addressName = address.addressId;
  }

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: true });

  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(newAddress),
    credentials: 'include'
  };

  await fetch(path, options)
    .then((res) => {
      localStorage.setItem('shippingDataCompleted', true);
      if (res.status !== 204) {
        res.json();
      }
    })
    .catch((error) => console.log(error));
};

const setMasterdataFields = async (completeFurnitureForm, completeTVIDForm, tries = 1) => {
  /* Data will only be searched and set if any of the custom fields for TFG are displayed. */
  if (completeFurnitureForm || completeTVIDForm) {
    const { address } = window.vtexjs.checkout.orderForm.shippingData;

    /* Setting Masterdata custom fields */
    const fields = '?_fields=buildingType,parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace'
      + ',assembleFurniture,tvID';

    const shippingData = await getShippingData(address.addressId, fields);

    if (shippingData && !jQuery.isEmptyObject(shippingData)) {
      /* Setting furniture form values */
      if (completeFurnitureForm) {
        $('#tfg-building-type').val(shippingData.buildingType);
        $('#tfg-parking-distance').val(shippingData.parkingDistance);
        $('#tfg-delivery-floor').val(shippingData.deliveryFloor);
        if ($('#tfg-delivery-floor').val() === 'Ground') {
          $('#tfg-lift-stairs').attr('disabled', 'disabled');
        } else {
          $('#tfg-lift-stairs').val(shippingData.liftOrStairs);
        }
        $('#tfg-sufficient-space').prop('checked', shippingData.hasSufficientSpace);
        $('#tfg-assemble-furniture').prop('checked', shippingData.assembleFurniture);
      }

      /* Setting TV form values */
      if (completeTVIDForm) {
        $('#tfg-tv-licence').val(shippingData.tvID);
      }
    } else if (tries <= 5) {
      setTimeout(() => {
        setMasterdataFields(completeFurnitureForm, completeTVIDForm, (tries += 1));
      }, 3000);
    }
  }
};

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
    data: JSON.stringify(customData)
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
      province: address.state
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

const isValidNumberBash = (tel) => {
  const pattern = new RegExp('^\\d{10}$');
  tel = tel.trim();
  return !!tel.match(pattern);
};

export {
  getShippingData,
  saveAddress,
  addBorderTop,
  waitAndResetLocalStorage,
  checkoutGetCustomData,
  checkoutSendCustomData,
  setRicaFields,
  setMasterdataFields,
  isValidNumberBash
};
