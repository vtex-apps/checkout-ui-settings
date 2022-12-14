import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';
import { FURNITURE_FEE_LINK } from '../../utils/const';

const DeliverContainer = ({ hasFurn }) => `
  <div class="bash--delivery-container" data-view="select-address">
  
    <section class="bash--delivery-view" data-section="select-address">
    <div class="bash--heading">
        <h2>Delivery address</h2>
        <a href="#" data-view="address-search">Add address</a>
      </div>
      ${Addresses()}
    </section>

    <section class="bash--delivery-view" data-section="address-search">
      <div class="bash--heading">
        <h2>Add a new delivery address</h2>
        <a href="#" data-view="select-address">&lt; Back</a>
      </div>
      ${AddressSearch()} 
    </section>
    
    <section class="bash--delivery-view" data-section="address-form">
      <div class="bash--heading">
        <h2>Complete address</h2>
        <a href="#" data-view="address-search">&lt; Back</a>
      </div>
      ${AddressForm()}
    </section>

    <section class="shipping-method" data-section="delivery-options">
      <hr>
      <div class="shipping-section-title">
        <h2>Delivery options</h2>
        ${hasFurn ? FURNITURE_FEE_LINK : '<div></div>'}
      </div>
    </section>

    <section class="bash--delivery-view" data-section="complete-address">
      <h2>Complete address</h2>
      <a href="#" data-view="select-address">&lt; Back</a>
    </section>

    <section class="bash--delivery-view" data-section="edit-address">
      <h2>Edit address</h2>
      <a href="#" data-view="select-address">&lt; Back</a>
    </section>
    
  </div>`;

export default DeliverContainer;
