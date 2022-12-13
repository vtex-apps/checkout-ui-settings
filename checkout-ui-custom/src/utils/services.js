import { BASE_URL_API } from './const';
import { getBestPhoneNumber } from './phoneFields';

// API Functions

const catchError = (message) => {
  console.error('ERROR', message);
  throw new Error(message);
};

const getHeadersByConfig = ({ cookie, cache, json }) => {
  const headers = new Headers();
  if (cookie) headers.append('Cookie', document?.cookie);
  if (cache) headers.append('Cache-Control', 'no-cache');
  if (json) headers.append('Content-type', 'application/json');
  return headers;
};

// GET addresses

export const getAddresses = async () => {
  const { email } = window.vtexjs.checkout.orderForm?.clientProfileData;

  const fields = [
    'id',
    'addressType',
    'addressQuery',
    'addressName',
    'reference',
    'number',
    'geolocation',
    'receiverName',
    'complement',
    'companyBuilding',
    'street',
    'neighborhood',
    'city',
    'postalCode',
    'state',
    'country',
    'buildingType',
    'parkingDistance',
    'deliveryFloor',
    'liftOrStairs',
    'hasSufficientSpace',
    'assembleFurniture',
    'tvID',
  ].join(',');

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: false });
  const options = {
    headers,
    credentials: 'include',
  };

  const cacheBust = Date.now();

  return fetch(
    `${BASE_URL_API}masterdata/addresses?t=${cacheBust}&_fields=${fields}&_where=${encodeURIComponent(
      `userIdQuery=${email}`
    )}`,
    options
  )
    .then((res) => res.json())
    .then((data) => data)
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
    options
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

  if (!address) return Promise.reject(new Error("'No address provided.'"));

  console.info({ address });
  // Address already exists (?)
  const savedAddress = address.addressName ? await getAddress(address.addressName, '?_fields=id') : {};

  console.info({ savedAddress });

  if (savedAddress?.id) {
    path = `${BASE_URL_API}masterdata/address/${savedAddress.id}`;
  } else {
    path = `${BASE_URL_API}masterdata/addresses`;
  }

  address.complement = address.complement || getBestPhoneNumber();

  // Importante respetar el orden de address para no sobreescribir receiver, complement y neighborhood
  const newAddress = {
    userId: email,
    ...address,
  };

  if (!savedAddress.id) {
    newAddress.addressName = address.addressId || `address-${Date.now()}`;
  }

  console.info({ newAddress });

  const headers = getHeadersByConfig({ cookie: true, cache: true, json: true });

  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(newAddress),
    credentials: 'include',
  };

  await fetch(path, options)
    .then((res) => {
      console.info({ res, status: res.status });
      if (res.status !== 204) {
        return res.json();
      }
      return res;
    })
    .then((result) => {
      console.info({ result });
      return result;
    })
    .catch((error) => catchError(`SAVE_ADDRESS_ERROR: ${error?.message}`));
};

export default getAddresses;
