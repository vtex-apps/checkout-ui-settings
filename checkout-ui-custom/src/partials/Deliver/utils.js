import { clearLoaders, getSpecialCategories } from '../../utils/functions';
import { addOrUpdateAddress, getAddressByName, updateAddressListing } from '../../utils/services';
import { requiredAddressFields, requiredFurnitureFields, requiredRicaFields, validAddressTypes } from './constants';

export const setDeliveryLoading = () => {
  document.querySelector('.bash--delivery-container').classList.add('shimmer');
};

export const mapGoogleAddress = (addressComponents, geometry) => {
  const streetNumber = addressComponents.find((item) => item.types.includes('street_number'))?.long_name;
  const street = addressComponents.find((item) => item.types.includes('route'))?.long_name;
  const neighborhood = addressComponents.find((item) => item.types.includes('sublocality'))?.long_name;
  const city = addressComponents.find((item) => item.types.includes('locality'))?.long_name;
  const postalCode = addressComponents.find((item) => item.types.includes('postal_code'))?.long_name;
  const state = addressComponents.find((item) => item.types.includes('administrative_area_level_1'))?.long_name;

  const coords = { lat: '', lng: '' };
  if (geometry) {
    coords.lat = geometry.location.lat();
    coords.lng = geometry.location.lng();
  }

  return {
    street: `${streetNumber ?? ''} ${street ?? ''}`.trim(),
    neighborhood,
    city,
    postalCode,
    state,
    ...coords,
  };
};

const provinceShortCode = (province) => {
  switch (province) {
    case 'Select':
      return '';
    case 'Western Cape':
      return 'WC';
    case 'Easter Cape':
      return 'EC';
    case 'Gauteng':
      return 'GP';
    case 'KwaZulu-Natal':
    case 'KwaZulu Natal':
      return 'KZN';
    case 'Northern Cape':
      return 'NC';
    case 'Limpopo':
      return 'LP';
    case 'Mpumalanga':
      return 'MP';
    case 'North West':
      return 'NW';
    case 'Freestate':
    case 'Free State':
      return 'FS';
    default:
      return province;
  }
};

const populateAddressFromSearch = (address) => {
  const { street, neighborhood, postalCode, state, city } = address;

  // Clear any populated fields
  document.getElementById('bash--address-form').reset();

  document.getElementById('bash--input-number').value = '';
  document.getElementById('bash--input-street').value = street;
  document.getElementById('bash--input-neighborhood').value = neighborhood;
  document.getElementById('bash--input-city').value = city;
  document.getElementById('bash--input-postalCode').value = postalCode;
  document.getElementById('bash--input-state').value = provinceShortCode(state);
};

export const populateAddressForm = (address) => {
  const { street, neighborhood, postalCode, state, city, receiverName, complement, id, addressName } = address;

  // Clear any populated fields
  document.getElementById('bash--address-form').reset();

  // Only overwrite defaults if values exist.
  if (receiverName) document.getElementById('bash--input-receiverName').value = receiverName;
  if (complement) document.getElementById('bash--input-complement').value = complement;

  // addressId indicates that address is being edited / completed.
  if (id) document.getElementById('bash--input-addressId').value = id;
  if (id) document.getElementById('bash--input-addressName').value = addressName;

  document.getElementById('bash--input-number').value = '';
  document.getElementById('bash--input-street').value = street;
  document.getElementById('bash--input-neighborhood').value = neighborhood;
  document.getElementById('bash--input-city').value = city;
  document.getElementById('bash--input-postalCode').value = postalCode;
  document.getElementById('bash--input-state').value = provinceShortCode(state);

  // TODO Furniture, Rica fields.
  // Ensure it happens after they are in the DOM.
};

export const initGoogleAutocomplete = () => {
  const input = document.getElementById('bash--input-address-search');
  const autocomplete = new window.google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'ZA' },
  });
  window.google.maps.event.addListener(autocomplete, 'place_changed', () => {
    const place = autocomplete.getPlace();
    const { address_components: addressComponents, geometry } = place;

    const address = mapGoogleAddress(addressComponents, geometry);

    // Populate the form
    // Set view to add-address
    populateAddressFromSearch(address);
    window.postMessage({ action: 'setDeliveryView', view: 'address-form' });
  });
};

export const parseAttribute = (data) => JSON.parse(decodeURIComponent(data));

export const populateExtraFields = (address, fields) => {
  for (let i = 0; i < fields.length; i++) {
    if (
      document.getElementById(`bash--input-${fields[i]}`) &&
      address[fields[i]] &&
      !document.getElementById(`bash--input-${fields[i]}`).value
    ) {
      document.getElementById(`bash--input-${fields[i]}`).value = address[fields[i]];
    }
  }
};

// Runs when you setAddress
export const addressIsValid = (address, validateExtraFields = true) => {
  const { items } = window.vtexjs.checkout.orderForm;
  const { hasFurniture, hasTVs, hasSimCards } = getSpecialCategories(items);

  let requiredFields = [];
  const invalidFields = [];

  // TODO more fields for Rica (sim?)

  requiredFields = [...requiredAddressFields];

  // Clear the extra fields.

  if (hasFurniture && validateExtraFields) {
    requiredFields = [...requiredFields, ...requiredFurnitureFields];
  }

  if ((hasTVs || hasSimCards) && validateExtraFields) {
    requiredFields = [...requiredFields, ...requiredRicaFields];
  }

  for (let i = 0; i < requiredFields.length; i++) {
    if (!address[requiredFields[i]]) invalidFields.push(requiredFields[i]);
  }

  return { isValid: !invalidFields.length, invalidFields };
};

// TODO move somewhere else?
export const setAddress = (address, options = { validateExtraFields: true }) => {
  const { validateExtraFields } = options;
  const { items } = window.vtexjs.checkout.orderForm;
  const { hasFurniture, hasTVs, hasSimCards } = getSpecialCategories(items);

  if (hasFurniture) {
    populateExtraFields(address, requiredFurnitureFields);
  }

  if (hasTVs || hasSimCards) {
    populateExtraFields(address, requiredRicaFields);
  }

  const { isValid, invalidFields } = addressIsValid(address, validateExtraFields);

  if (!isValid) {
    populateAddressForm(address);
    $('#bash--address-form').addClass('show-form-errors');
    if (validateExtraFields) $('#bash--delivery-form')?.addClass('show-form-errors');
    $(`#bash--input-${invalidFields[0]}`).focus();

    if (requiredAddressFields.includes(invalidFields[0])) {
      window.postMessage({
        action: 'setDeliveryView',
        view: 'address-form',
      });
    }

    return;
  }

  // Fix bad addressType.
  if (address.addressType === 'business') address.addressType = 'commercial';
  if (!validAddressTypes.includes(address.addressType)) address.addressType = 'residential';

  const { shippingData } = window?.vtexjs?.checkout?.orderForm;

  shippingData.address = address;
  shippingData.address.number = shippingData.address.number ?? ' ';
  shippingData.selectedAddresses = [address];

  // Start Shimmering
  setDeliveryLoading();
  window.vtexjs.checkout
    .sendAttachment('shippingData', shippingData)
    .then(() => {
      // End shimmer
      updateAddressListing(shippingData.address);
    })
    .done(() => clearLoaders());
};

export const submitAddressForm = async (event) => {
  event.preventDefault();

  const form = document.forms['bash--address-form'];

  const storedAddress = await getAddressByName($('[name="selected-address"]:checked').val());
  console.info({ storedAddress });

  const { isValid, invalidFields } = addressIsValid(storedAddress, true);

  if (!isValid) {
    populateAddressForm(storedAddress);
    $('#bash--address-form').addClass('show-form-errors');
    $('#bash--delivery-form')?.addClass('show-form-errors');
    $(`#bash--input-${invalidFields[0]}`).focus();

    if (requiredAddressFields.includes(invalidFields[0])) {
      window.postMessage({
        action: 'setDeliveryView',
        view: 'address-form',
      });
    }

    return;
  }

  const fields = [
    'addressId',
    'addressName',
    'addressType',
    'receiverName',
    'postalCode',
    'city',
    'state',
    'country',
    'street',
    'neighborhood',
    'complement',
  ];

  const address = {
    isDisposable: false,
    reference: null,
    geoCoordinates: [],
    number: '',
    country: 'ZAF',
  };

  for (let f = 0; f < fields.length; f++) {
    address[fields[f]] = form[fields[f]]?.value || null;
  }

  address.addressName = address.addressName || address.addressId;
  address.addressId = address.addressId || address.addressName;

  // Apply the selected address to customers orderForm.
  // TODO deselect the currently checked address, select this address.
  const checkoutAddress = await setAddress(address);

  // Update the localstore, and the API
  const savedAddress = await addOrUpdateAddress(address);

  console.info({ savedAddress, checkoutAddress });

  window.postMessage({ action: 'setDeliveryView', view: 'select-address' });
};

export const submitDeliveryForm = async (event) => {
  event.preventDefault();
  const { items } = window.vtexjs.checkout.orderForm;
  const { hasFurniture, hasTVs, hasSimCards } = getSpecialCategories(items);

  let fullAddress = {};

  const { address } = window.vtexjs.checkout.orderForm.shippingData;

  fullAddress = { ...address };

  if (hasFurniture) {
    const fields = requiredFurnitureFields;
    for (let i = 0; i < fields.length; i++) {
      if (!address[fields[i]]) fullAddress[fields[i]] = $(`#bash--input-${fields[i]}`).val();
    }
  }

  if (hasTVs || hasSimCards) {
    const fields = requiredRicaFields;
    for (let i = 0; i < fields.length; i++) {
      if (!address[fields[i]]) fullAddress[fields[i]] = document.getElementById(`bash--input-${fields[i]}`).value;
    }
  }

  // Extra fields are not needed for setAddress...
  // Set address in orderForm
  setAddress(fullAddress);

  // Save address info locally
  // Send saved address to API
  const savedAddress = await addOrUpdateAddress(fullAddress);
  console.info({ savedAddress });

  window.location.hash = 'payment';
};

export const getBestRecipient = () => {
  const { receiverName } = window.vtexjs.checkout.orderForm?.shippingData?.address;
  const { firstName, lastName } = window.vtexjs.checkout.orderForm?.clientProfileData;
  const clientProfileName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return receiverName || document.getElementById('client-first-name')?.value || clientProfileName;
};

export default mapGoogleAddress;
