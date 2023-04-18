import { requiredAddressFields, requiredTVFields, validAddressTypes } from '../partials/Deliver/constants';
import {
  addressIsValid,
  populateAddressForm,
  populateDeliveryError,
  populateExtraFields,
  populateRicaFields,
  setDeliveryLoading
} from '../partials/Deliver/utils';
import { AD_TYPE, DELIVER_APP } from './const';
import { clearLoaders, getSpecialCategories } from './functions';
import sendEvent from './sendEvent';
import { sendOrderFormCustomData, updateAddressListing } from './services';

const updateDeliveryData = ({ businessName, receiverPhone }) => {
  sendOrderFormCustomData(DELIVER_APP, {
    jsonString: JSON.stringify(
      {
        businessName: businessName || '',
        receiverPhone: receiverPhone || ''
      }
    )
  });
};

const setAddress = (address, options = { validateExtraFields: true }) => {
  console.info('### setAddress ###', { address });
  const { validateExtraFields } = options;
  const { items } = window.vtexjs.checkout.orderForm;
  const { hasTVs, hasSimCards } = getSpecialCategories(items);

  if (hasTVs) populateExtraFields(address, requiredTVFields, 'tv_');
  if (hasSimCards) populateRicaFields();

  const { isValid, invalidFields } = addressIsValid(address, validateExtraFields);

  if (!isValid) {
    console.error({ invalidFields });
    populateAddressForm(address);
    $('#bash--address-form').addClass('show-form-errors');
    if (validateExtraFields) $('#bash--delivery-form')?.addClass('show-form-errors');
    $(`#bash--input-${invalidFields[0]}`).focus();

    if (requiredAddressFields.includes(invalidFields[0])) {
      window.postMessage({
        action: 'setDeliveryView',
        view: 'address-edit',
      });
    }

    return { success: false, error: 'Invalid address details.' };
  }

  // Fix bad addressType.
  if (address.addressType === AD_TYPE.BUSINESS) address.addressType = AD_TYPE.COMMERCIAL;
  if (!validAddressTypes.includes(address.addressType)) address.addressType = AD_TYPE.DELIVERY;

  if (address.number) {
    address.street = `${address.number} ${address.street}`;
    address.number = '';
  }

  // Country must always be 'ZAF'
  address.country = 'ZAF';

  const { shippingData } = window?.vtexjs?.checkout?.orderForm;

  shippingData.address = address;
  shippingData.selectedAddresses = [address];

  // Stop using "complement" field
  if (address.complement) {
    address.receiverPhone = address.complement;
    shippingData.address.complement = '';
    address.complement = '';
  }

  if (address.companyBuilding && !shippingData.address.street.includes(`, ${address.companyBuilding}`)) {
    shippingData.address.street = `${address.street}, ${address.companyBuilding}`;
  }
  shippingData.selectedAddresses[0] = shippingData.address;

  // Start Shimmering
  setDeliveryLoading();
  return window.vtexjs.checkout
    .sendAttachment('shippingData', shippingData)
    .then((orderForm) => {
      const { messages } = orderForm;
      const errors = messages.filter((msg) => msg.status === 'error');

      if (errors.length > 0) {
        populateDeliveryError(errors);
        window.postMessage({
          action: 'setDeliveryView',
          view: 'address-form',
        });

        return { success: false, errors };
      }

      if (address.addressName) updateAddressListing(address);

      console.info('### Update customData ###', { address });
      try {
        updateDeliveryData({ businessName: address.businessName, receiverPhone: address.receiverPhone });
      } catch (e) {
        sendEvent({
          eventCategory: 'Checkout_SystemError',
          action: 'OrderFormFailed',
          label: 'Could not update businessName and/or receiverPhone ',
          description: 'Could not update businessName and/or receiverPhone.'
        });
      }

      return { success: true };
    })
    .done(() => clearLoaders());
};

export default setAddress;
