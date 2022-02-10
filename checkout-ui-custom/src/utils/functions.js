/* eslint-disable import/prefer-default-export */
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

export {
  getCustomShippingData
};
