/* eslint-disable import/prefer-default-export */
import { RICA_APP } from './const';

// API Functions
const getShippingData = async (addressName, fields) => {
  let data = {};

  const options = {
    headers: { 'Cache-Control': 'no-cache' }
  };

  const response = await fetch(
    `/custom-api/masterdata/addresses/${fields}&_where=addressName=${addressName}&timestamp=${Date.now()}`,
    options
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));

  if (response && !response.error && response.data && response.data.length > 0) {
    [data] = response.data;
  }

  return data;
};

const saveAddress = async (fields = {}, shippingDataCompleted = false) => {
  let path;
  const { email } = window.vtexjs.checkout.orderForm.clientProfileData;
  const { address } = window.vtexjs.checkout.orderForm.shippingData;

  // AD already exists (?)
  const savedAddress = await getShippingData(address.addressId, '?_fields=id');

  if (savedAddress.id) {
    path = `/custom-api/masterdata/address/${savedAddress.id}`;
  } else {
    path = '/custom-api/masterdata/addresses';
  }

  // Importante respetar el orden de address para no sobreescribir receiver, complement y neighborhood
  const newAddress = {
    userId: email,
    ...address,
    ...fields
  };

  console.log('!! newAddress', newAddress);

  if (!savedAddress.id) {
    newAddress.addressName = address.addressId;
  }

  const options = {
    method: 'PATCH',
    headers: { 'Cache-Control': 'no-cache' },
    body: JSON.stringify(newAddress)
  };

  await fetch(path, options)
    .then((res) => {
      if (shippingDataCompleted) {
        localStorage.setItem('shippingDataCompleted', true);
      }

      /*  The field created to control the "Address correctly saved" message is removed */
      if (localStorage.getItem('custom-address-form-fields')) {
        localStorage.removeItem('custom-address-form-fields');
      }

      /* Update orderForm.shippingData */
      window.vtexjs.checkout.calculateShipping(newAddress);

      if (res.status !== 204) {
        res.json();
      }
    })
    .catch((error) => console.log(error));
};

const setMasterdataFields = async (completeFurnitureForm, completeTVIDForm, tries = 1) => {
  /* Data will only be searched and set if any of the custom fields for TFG are displayed. */
  if ($('#custom-field-companyBuilding').length > 0 || completeFurnitureForm || completeTVIDForm) {
    const { address } = window.vtexjs.checkout.orderForm.shippingData;

    /* Setting Masterdata custom fields */
    const fields = '?_fields=receiverName,complement,companyBuilding,neighborhood,buildingType,'
      + 'parkingDistance,deliveryFloor,liftOrStairs,hasSufficientSpace,assembleFurniture,tvID';

    const shippingData = await getShippingData(address.addressId, fields);

    if (shippingData && !jQuery.isEmptyObject(shippingData)) {
      $('#custom-field-receiverName')
        .val(shippingData.receiverName)
        .attr('value', shippingData.receiverName);

      $('#custom-field-complement')
        .val(shippingData.complement)
        .attr('value', shippingData.complement);

      $('#custom-field-companyBuilding')
        .val(shippingData.companyBuilding)
        .attr('value', shippingData.companyBuilding);

      $('#custom-field-neighborhood')
        .val(shippingData.neighborhood)
        .attr('value', shippingData.neighborhood);

      /* Adding correct data to localStorage */
      const customFields = {
        receiverName: shippingData.receiverName,
        complement: shippingData.complement,
        companyBuilding: shippingData.companyBuilding,
        neighborhood: shippingData.neighborhood
      };

      localStorage.setItem('custom-address-form-fields', JSON.stringify(customFields));

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

  if (getDataFrom === 'customApps') {
    ricaFields = checkoutGetCustomData(RICA_APP);
  } else if (getDataFrom === 'shippingAddress') {
    const { address } = window.vtexjs.checkout.orderForm.shippingData;

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
