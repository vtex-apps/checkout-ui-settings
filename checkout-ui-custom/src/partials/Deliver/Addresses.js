import { clearLoaders, getAddresses } from '../../utils/functions';
import AddressListing from './AddressListing';

const Addresses = () => {
  getAddresses().then(({ data: addresses }) => {
    // if(addresses.length < 1)... go to Add Address

    const addressesHtml = addresses.map((address) => AddressListing(address));
    document.getElementById('bash-address-list').innerHTML = addressesHtml.join('');
    clearLoaders();
  });

  return `
 <div class="bash--addresses shimmer" id="bash-address-list">
    Loading addresses...
  </div>  
  `;
};

export default Addresses;
