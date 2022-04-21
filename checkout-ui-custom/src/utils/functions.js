/* eslint-disable import/prefer-default-export */

// API Functions
const getShippingData = async (addressName, fields) => {
  let data = {};

  const options = {
    headers: { 'Cache-Control': 'no-cache' }
  };

  const response = await fetch('/custom-api/masterdata/addresses/'
    + `${fields}&_where=addressName=${addressName}&timestamp=${Date.now()}`, options)
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (response && !response.error && response.data && response.data.length > 0) {
    [data] = response.data;
  }

  return data;
};

const saveAddress = async (fields) => {
  let path;
  const { email } = vtexjs.checkout.orderForm.clientProfileData;
  const { address } = vtexjs.checkout.orderForm.shippingData;

  // AD already exists (?)
  const searchFields = '?_fields=id';
  const savedAddress = await getShippingData(address.addressId, searchFields);

  if (savedAddress.id) {
    path = `/custom-api/masterdata/address/${savedAddress.id}`;
  } else {
    path = '/custom-api/masterdata/addresses';
  }

  const body = {
    userId: email,
    ...fields,
    ...address
  };

  if (!savedAddress.id) {
    body.addressName = address.addressId;
  }

  const options = {
    method: 'PATCH',
    headers: { 'Cache-Control': 'no-cache' },
    body: JSON.stringify(body)
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

// Random Functions
const addBorderTop = (elementClass) => {
  if ($(elementClass).length > 1) {
    $(elementClass).addClass('custom-step-border');
    $(elementClass).last().addClass('last-custom-step-border');
  }
};

const waitAndResetLocalStorage = () => {
  setTimeout(() => {
    localStorage.removeItem('shippingDataCompleted');
  }, 5000);
};

export {
  getShippingData,
  saveAddress,
  addBorderTop,
  waitAndResetLocalStorage
};

// TODO: LEFT HERE FOR RICA FIELDS
/*
import {
  CUSTOM_FIELDS_APP
} from './const';

const getShippingData = () => {
  const { customData } = vtexjs.checkout.orderForm;
  let fields = {};

  if (customData && customData.customApps && customData.customApps.length > 0) {
    customData.customApps.forEach((app) => {
      if (app.id === CUSTOM_FIELDS_APP) {
        fields = app.fields;
      }
    });
  }

  return fields;
};

const checkoutSendCustomData = (appId, customData) => {
  const { orderFormId } = vtexjs.checkout.orderForm;

  return $.ajax({
    type: 'PUT',
    url:
      `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}`,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(customData)
  });
};
*/
