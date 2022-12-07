const AddressListing = (address) => {
  console.info('AddressListing', { address });

  const { number, street, neighborhood, postalCode, city, receiverName, complement } = address;

  const addressLine = [`${number} ${street}`, neighborhood ?? city, postalCode].join(', ');
  const contactLine = [receiverName, complement].join(' - ');

  return `
<div class="bash--address-listing">
  <div class="address-radio">
   <svg class="empty-radio" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z"
        fill="#040404"></path>
    </svg>
    <svg class="checked-radio" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 4C5.792 4 4 5.792 4 8s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4zm0-4C3.584 0 0 3.584 0 8s3.584 8 8 8 8-3.584 8-8-3.584-8-8-8zm0 14.4A6.398 6.398 0 0 1 1.6 8c0-3.536 2.864-6.4 6.4-6.4 3.536 0 6.4 2.864 6.4 6.4 0 3.536-2.864 6.4-6.4 6.4z"
        fill="#040404"></path>
    </svg>
  </div>
  <div class="address-text">
    <div>${addressLine}</div>  
    <div>${contactLine}</div>  
  </div>
  <div class="address-edit">
    <a href="#" data-view="edit-address">
    Edit
    </a>
  </div>
</div>
`;
};

export default AddressListing;
