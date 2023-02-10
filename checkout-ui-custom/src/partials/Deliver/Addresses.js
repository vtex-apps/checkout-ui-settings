import { clearLoaders } from '../../utils/functions';
import { getAddresses } from '../../utils/services';
import AddressListing from './AddressListing';

const Addresses = () => {
  getAddresses()
    .then(({ data: addresses }) => {
      const addressesHtml = addresses.map((address) => AddressListing(address));
      if (document.getElementById('bash-address-list')) {
        document.getElementById('bash-address-list').innerHTML = addressesHtml.join('');
      }
      if ($('#back-button-select-address').hasClass('inactive')) {
        $('#back-button-select-address').show();
      }
      clearLoaders();
      if (addresses.length < 1) {
        window.postMessage({ action: 'setDeliveryView', view: 'address-search' });
        $('#bash--input-address-search').focus();
        $('#back-button-select-address').hide();
        $('#back-button-select-address').addClass('inactive');
      }
    })
    .catch((e) => {
      console.error('ERROR getAddresses', e);
      throw new Error('Error getAddresses', e.message);
    });

  return `
 <div class="bash--addresses shimmer" id="bash-address-list">
    Loading addresses...
  </div>
  `;
};

export default Addresses;
