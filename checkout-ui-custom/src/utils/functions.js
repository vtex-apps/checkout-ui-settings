/* eslint-disable import/prefer-default-export */

// TODO: LEFT HERE FOR RICA FIELDS
/*
import {
  CUSTOM_FIELDS_APP
} from './const';

const getCustomShippingData = () => {
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
 */

const getCustomShippingData = () => {
  if (vtexjs.checkout.orderForm.shippingData && vtexjs.checkout.orderForm.shippingData.address) {
    const { addressId } = vtexjs.checkout.orderForm.shippingData.address;
    const params = {
      headers: {
        VtexIdclientAutCookie: ''
      }
    };

    const fields = '?_fields=companyBuilding,furnitureReady,buildingType,parkingDistance,deliveryFloor,liftOrStairs,'
      + 'hasSufficientSpace,assembleFurniture,tvID';
    const where = `&_where=addressName=${addressId}`;

    fetch(`safedata/AD/search${fields + where}`, params)
      .then((response) => response.json())
      .catch((error) => console.log(error))
      .then((data) => data);
  }
};

const getCustomShippingDataFromLS = () => {
  const furnitureFields = localStorage.getItem('furnitureFields')
    ? JSON.parse(localStorage.getItem('furnitureFields')) : {};
  const TVFields = localStorage.getItem('TVFields')
    ? JSON.parse(localStorage.getItem('TVFields')) : {};

  return { ...furnitureFields, ...TVFields };
};

const addBorderTop = (elementClass) => {
  if ($(elementClass).length > 1) {
    $(elementClass).addClass('custom-step-border');
    $(elementClass).first().addClass('tfg-mtop-25');
  }
};

export {
  getCustomShippingData,
  getCustomShippingDataFromLS,
  addBorderTop
};
