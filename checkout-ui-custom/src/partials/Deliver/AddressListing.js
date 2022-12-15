import Radio from './Elements/Radio';
import { isSelectedAddress } from './utils';

const AddressListing = (address) => {
  const { number, street, neighborhood, postalCode, city, receiverName, complement, id } = address;

  const addressLine = [`${number ?? ''} ${street}`, neighborhood ?? city, postalCode].join(', ');
  const contactLine = [receiverName, complement].join(' - ');

  // orderform
  const { address: selectedAddress } = window?.vtexjs?.checkout?.orderForm?.shippingData;

  const addressString = encodeURIComponent(JSON.stringify(address));

  console.info('AddressListing', { address });

  return `
<label id="address-${id}" class="bash--address-listing" data-address="${addressString}">
  <div class="address-radio">
  ${Radio({ name: 'selected-address', options: [{ checked: isSelectedAddress(address, selectedAddress), value: id }] })}
  </div>
  <div class="address-text">
    <div>${addressLine}</div>    
    <div>${contactLine}</div>  
  </div>
  <div class="address-edit">
    <a href="#" data-view="address-form" data-content="address-${id}">
      Edit
    </a>
  </div>
</label>
`;
};

export default AddressListing;
