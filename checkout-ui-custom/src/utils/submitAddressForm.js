// @ts-nocheck
import { requiredAddressFields } from '../partials/Deliver/constants';
import { addressIsValid, showAlertBox } from '../partials/Deliver/utils';
import { addOrUpdateAddress, getAddressByName } from './services';
import setAddress from './setAddress';

const submitAddressForm = async (event) => {
  event.preventDefault();

  // Prevent false positive for invalid selects.
  $('select').change();

  const form = document.forms['bash--address-form'];
  const addressName = $('#bash--input-addressName').val();
  const storedAddress = await getAddressByName(addressName);

  const fields = [
    'addressId',
    'addressName',
    'addressType',
    'receiverName',
    'receiverPhone',
    'postalCode',
    'city',
    'state',
    'country',
    'businessName',
    'street',
    'neighborhood',
    'complement',
    'companyBuilding',
    'lat',
    'lng',
  ];

  const address = {
    isDisposable: false,
    reference: null,
    geoCoordinates: [],
    country: 'ZAF',
    ...storedAddress,
    number: '', // stop using number field (combined with street).
    complement: '', // stop using complement field (ifo receiverPhone).
  };

  for (let f = 0; f < fields.length; f++) {
    address[fields[f]] = form[fields[f]]?.value || null;
  }

  address.addressName = address.addressName || address.addressId;
  address.addressId = address.addressId || address.addressName;

  const geoCoords = [parseFloat(address.lng) || '', parseFloat(address.lat) || ''];
  address.geoCoordinate = geoCoords; // for MasterData
  address.geoCoordinates = geoCoords; // for shippingData

  const shippingAddress = address;
  const { isValid, invalidFields } = addressIsValid(address, false);

  if (!isValid) {
    console.error({ invalidFields });
    $('#bash--address-form').addClass('show-form-errors');
    $(`#bash--input-${invalidFields[0]}`).focus();
    if (requiredAddressFields.includes(invalidFields[0])) {
      window.postMessage({
        action: 'setDeliveryView',
        view: 'address-form',
      });
    }

    window.postMessage(
      {
        type: 'ADDRESS_VALIDATION_ERROR',
        message: 'Address validation error. See invalidFields.',
        invalidFields,
      },
      '*'
    );

    return;
  }

  // Apply the selected address to customers orderForm.
  const setAddressResponse = await setAddress(shippingAddress, { validateExtraFields: false });
  const { success } = setAddressResponse;
  if (!success) {
    console.error('Set address error', { setAddressResponse });
    return;
  }

  await addOrUpdateAddress(address);

  window.postMessage({ action: 'setDeliveryView', view: 'select-address' });

  // Scroll up
  setTimeout(() => {
    if ($('.bash--extra-fields').length > 0) {
      document.querySelector('.bash--extra-fields').scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('bash-delivery-options').scrollIntoView({ behavior: 'smooth' });
    }
  }, 500);
  showAlertBox();
};

export default submitAddressForm;
