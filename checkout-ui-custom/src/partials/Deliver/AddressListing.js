import Radio from './Elements/Radio';

const AddressListing = (address) => {
  const { number, street, neighborhood, postalCode, city, receiverName, complement, id } = address;

  const addressLine = [`${number ?? ''} ${street}`, neighborhood ?? city, postalCode].join(', ');
  const contactLine = [receiverName, complement].join(' - ');

  // orderform
  const { addressId } = window?.vtexjs?.checkout?.orderForm?.shippingData?.address;

  const addressString = encodeURIComponent(JSON.stringify(address));

  return `
<label id="address-${id}" class="bash--address-listing" data-address="${addressString}">
  <div class="address-radio">
  ${Radio({ name: 'selected-address', options: [{ checked: id === addressId, value: id }] })}
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
