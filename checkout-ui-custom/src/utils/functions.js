/* eslint-disable import/prefer-default-export */
import { RICA_APP } from './const';

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

  if (response && !response.error && response.data.length > 0) {
    [data] = response.data;
  }

  return data;
};

const saveAddress = async (fields) => {
  let path;
  const { email } = vtexjs.checkout.orderForm.clientProfileData;
  const { address } = vtexjs.checkout.orderForm.shippingData;

  // AD already exists (?)
  const savedAddress = await getShippingData(address.addressId, '?_fields=id');

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
      if (res.status !== 204) {
        localStorage.setItem('shippingDataCompleted', true);
        res.json();
      }
    })
    .catch((error) => console.log(error));
};

const setMasterdataFields = async (completeFurnitureForm, completeTVIDForm) => {
  const { addressId } = vtexjs.checkout.orderForm.shippingData.address;
  const fields = '?_fields=companyBuilding,furnitureReady,buildingType,'
    + 'parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';

  const customShippingInfo = await getShippingData(addressId, fields);

  if (customShippingInfo && !jQuery.isEmptyObject(customShippingInfo)) {
    if (completeFurnitureForm) {
      $('#tfg-building-type').val(customShippingInfo.buildingType);
      $('#tfg-parking-distance').val(customShippingInfo.parkingDistance);
      $('#tfg-delivery-floor').val(customShippingInfo.deliveryFloor);
      if ($('#tfg-delivery-floor').val() === 'Ground') {
        $('#tfg-lift-stairs').attr('disabled', 'disabled');
      } else {
        $('#tfg-lift-stairs').val(customShippingInfo.liftOrStairs);
      }
      $('#tfg-sufficient-space').prop('checked', (customShippingInfo.hasSufficientSpace === 'true'));
      $('#tfg-assemble-furniture').prop('checked', (customShippingInfo.assembleFurniture === 'true'));
    }

    if (completeTVIDForm) {
      $('#tfg-tv-licence').val(customShippingInfo.tvID);
    }
  }
};

// Functions to manage CustomData
const checkoutGetCustomData = (appId) => {
  const { customData } = vtexjs.checkout.orderForm;
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

const setRicaFields = (getDataFrom = 'customApps') => {
  let ricaFields;

  if (getDataFrom === 'customApps') {
    ricaFields = checkoutGetCustomData(RICA_APP);
  } else if (getDataFrom === 'shippingAddress') {
    const { address } = vtexjs.checkout.orderForm.shippingData;

    ricaFields = {
      idOrPassport: '',
      sameAddress: 'true',
      fullName: address.receiverName,
      streetAddress: `${address.street}, ${address.number}`,
      suburb: address.neighborhood,
      city: address.city,
      postalCode: address.postalCode,
      province: address.state
    };
  }

  if (ricaFields && !jQuery.isEmptyObject(ricaFields)) {
    $('#tfg-rica-id-passport').val(ricaFields.idOrPassport);
    $('#tfg-rica-same-address').prop('checked', (ricaFields.sameAddress === 'true'));
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
  waitAndResetLocalStorage,
  checkoutGetCustomData,
  checkoutSendCustomData,
  setRicaFields,
  setMasterdataFields
};
