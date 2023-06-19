import { formatPhoneNumber, prependZero } from '../../utils/phoneFields';
import Radio from './Elements/Radio';

const isSelectedAddress = (address, selectedAddress) => {
  const addressObject = JSON.stringify({
    street: address?.street || '',
    neighborhood: address?.neighborhood || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
  });

  const selectedAddressObject = JSON.stringify({
    street: selectedAddress?.street || '',
    neighborhood: selectedAddress?.neighborhood || '',
    city: selectedAddress?.city || '',
    postalCode: selectedAddress?.postalCode || '',
  });

  return addressObject === selectedAddressObject;
};

const AddressListing = (address) => {
  if (!address) return '';

  const {
    businessName,
    number,
    street,
    neighborhood,
    postalCode,
    city,
    receiverName,
    addressName,
    complement,
    receiverPhone,
  } = address;

  const addressLine = [
    `${businessName ? `${businessName}, ` : ''} ${number ? `${number.trim()} ` : ''}${street}`,
    neighborhood ?? city,
    postalCode,
  ]
    .join(', ')
    .trim();
  const contactLine = [receiverName, formatPhoneNumber(prependZero(receiverPhone || complement))].join(' - ');

  // orderform
  const selectedAddress = window?.vtexjs?.checkout?.orderForm?.shippingData?.address;
  const addressString = encodeURIComponent(JSON.stringify(address));

  return `
<label id="address-${addressName}" class="bash--address-listing" data-address="${addressString}">
  <div class="address-radio">
  ${Radio({
    name: 'selected-address',
    options: [{ checked: isSelectedAddress(address, selectedAddress), value: addressName }],
  })}
  </div>
  <div class="address-text">
    <div>${addressLine}</div>    
    <div>${contactLine}</div>  
  </div>
  <div class="address-edit">
    <a href="#" data-view="address-edit" data-content="address-${addressName}">
      Edit
    </a>
  </div>
</label>
`;
};

export default AddressListing;
