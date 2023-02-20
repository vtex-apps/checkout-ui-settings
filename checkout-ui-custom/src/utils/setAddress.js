import { requiredAddressFields, requiredTVFields, validAddressTypes } from '../partials/Deliver/constants';
import {
  addressIsValid,
  populateAddressForm,
  populateDeliveryError,
  populateExtraFields,
  populateRicaFields,
  setDeliveryLoading,
} from '../partials/Deliver/utils';
import { clearLoaders, getSpecialCategories } from './functions';
import { updateAddressListing } from './services';

const setAddress = (address, options = { validateExtraFields: true }) => {
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
  if (address.addressType === 'business') address.addressType = 'commercial';
  if (!validAddressTypes.includes(address.addressType)) address.addressType = 'residential';

  if (address.number) {
    address.street = `${address.number} ${address.street}`;
    address.number = '';
  }

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

      return { success: true };
    })
    .done(() => clearLoaders());
};

export default setAddress;
