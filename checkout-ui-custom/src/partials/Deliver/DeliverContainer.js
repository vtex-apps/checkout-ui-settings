import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';

const DeliverContainer = () => `
  <div class="bash--delivery-container" data-view="select-address">
    <section class="bash--delivery-view" data-section="select-address">
      <h3>Select address</h3>
      <a href="#" data-view="address-search">Add address</a>
      ${Addresses()}
    </section>

    <section class="bash--delivery-view" data-section="address-search">
      <h3>Add a new delivery address</h3>
      <a href="#" data-view="select-address">&lt; Back</a>
      ${AddressSearch()} 
    </section>
    
    
    <section class="bash--delivery-view" data-section="address-form">
      <h3>Add a new delivery address</h3>
      <a href="#" data-view="address-search">&lt; Back</a>
          ${AddressForm()}
    </section>

    <section class="bash--delivery-view" data-section="complete-address">
      <h3>Complete address</h3>
      <a href="#" data-view="select-address">&lt; Back</a>
    </section>

    <section class="bash--delivery-view" data-section="edit-address">
      <h3>Edit address</h3>
      <a href="#" data-view="select-address">&lt; Back</a>
    </section>
    
  </div>`;

export default DeliverContainer;
