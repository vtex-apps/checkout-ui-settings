/* eslint-disable no-new-wrappers */
import AddressListing from '../partials/Deliver/AddressListing';
import CheckoutDB from './checkoutDB';
import { BASE_URL_API } from './const';
import { catchError, clearLoaders, getHeadersByConfig } from './functions';

// API Functions
// GET addresses

const DB = new CheckoutDB();

export const getAddresses = async () => {
  // Try to get addresses from users local store.
  // TODO: When should addresses be reloaded/updated?

  const addresses = await DB.getAddresses();
  if (addresses.length > 0) return { data: addresses };

  // Fallback to get addresses from API.

  const { email } = window?.vtexjs?.checkout?.orderForm?.clientProfileData;

  const fields = [
    'id',
    'addressType',
    'addressQuery',
    'addressName',
    'reference',
    'number',
    'geolocation',
    'receiverName',
    'receiverPhone',
    'complement', // todo stop populating complement, in favour of companyBuilding
    'street',
    'businessName',
    'companyBuilding',
    'neighborhood',
    'city',
    'postalCode',
    'state',
    'country',
    'tvID',
    'geoCoordinate',
  ].join(',');

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: false });
  const options = {
    headers,
    credentials: 'include',
  };

  const cacheBust = Date.now();

  return fetch(
    `${BASE_URL_API}masterdata/addresses?t=${cacheBust}&_fields=${fields}&_where=${encodeURIComponent(
      `userIdQuery=${email}`,
    )}`,
    options,
  )
    .then((res) => res.json())
    .then(async (data) => {
      // Store addresses locally
      if (data.data) DB.loadAddresses(data.data);
      // return DB.getAddresses();
      // API can have dups.
      return data;
    })
    .catch((error) => catchError(`GET_ADDRESSES_ERROR: ${error?.message}`));
};

// GET Address by ID / Name?
const getAddress = async (addressName, fields) => {
  let data = {};
  const headers = getHeadersByConfig({ cookie: true, cache: true, json: false });
  const options = {
    headers,
    credentials: 'include',
  };

  const response = await fetch(
    `${BASE_URL_API}masterdata/addresses/${fields}&_where=addressName=${addressName}&timestamp=${Date.now()}`,
    options,
  )
    .then((res) => res.json())
    .catch((error) => catchError(`GET_ADDRESS_ERROR: ${error?.message}`));

  if (response && !response.error && response.data && response.data.length > 0) {
    [data] = response.data;
  }

  return data;
};

// PATCH address

export const upsertAddress = async (address) => {
  let path;
  const { email } = window.vtexjs.checkout.orderForm.clientProfileData;

  if (!address) return Promise.reject(new Error('No address provided.'));

  // Address already exists (?) - ID keeps channging?
  const existingAddress = address.addressName ? await getAddress(address.addressName, '?_fields=id') : {};

  if (existingAddress?.id) {
    path = `${BASE_URL_API}masterdata/address/${existingAddress.id}`;
  } else {
    path = `${BASE_URL_API}masterdata/addresses`;
  }

  const newAddress = {
    userId: email,
    ...address,
  };

  if (!existingAddress.id) {
    newAddress.addressName = address.addressId || `address-${Date.now()}`;
  }

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: true });

  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(newAddress),
    credentials: 'include',
  };

  await fetch(path, options)
    .then((res) => {
      if (res.status !== 204) {
        return res.json();
      }
      return res;
    })
    .then((result) => result)
    .catch((error) => catchError(`SAVE_ADDRESS_ERROR: ${error?.message}`));
};

export const updateAddressListing = (address) => {
  let $currentListing = $(`#address-${address.addressName}`);

  if (!$currentListing.length) {
    $('#bash-address-list').append(AddressListing(address));
  } else {
    $currentListing.after(AddressListing(address));
    $currentListing.remove();
    $currentListing = null;
  }

  $('input[type="radio"][name="selected-address"]:checked').attr('checked', false);
  $(`input[type="radio"][name="selected-address"][value="${address.addressName}"]`).attr('checked', true);
};

export const addOrUpdateAddress = async (address) => {
  if (!address.addressName) {
    const streetStr = address.street
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .replace(/\s/g, '-')
      .toLowerCase();
    address.addressName = `${Date.now()}-${streetStr}`.substring(0, 50);
  }

  if (!address.addressId) address.addressId = address.addressName;

  // Add or update at local store. Update UI.
  DB.addOrUpdateAddress(address).then(() => updateAddressListing(address));

  // Add or update at the API.
  upsertAddress(address);
};

export const getAddressByName = async (addressName) => DB.getAddress(addressName);

export const clearAddresses = async () => DB.clearData();

/**
 * OrderForm CustomData
 * @param {Object} data - custom data.
 * @param {string} appId - unique app id.
 * @param {boolean} furniture - boolean value for sending furniture.
 * @param {boolean} rica - boolean value for sending rica fields.
 */
export const sendOrderFormCustomData = async (appId, data, rica = false) => {
  const { orderFormId } = window.vtexjs.checkout.orderForm;

  const path = `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}`;
  const body = JSON.stringify({
    ...data,
    ...(rica && { sameAddress: new Boolean(data.sameAddress) }),
  });

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
  return fetch(path, options);
};

export const getOrderFormCustomData = (appId) => {
  const customData = window?.vtexjs?.checkout?.orderForm?.customData;
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

export const removeFromCart = (index) => window.vtexjs.checkout
  .updateItems([
    {
      index: `${index}`,
      quantity: 0,
    },
  ])
  .done(() => {
    clearLoaders();
  });

export default getAddresses;
