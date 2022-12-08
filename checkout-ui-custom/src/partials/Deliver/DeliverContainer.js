import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';

const DeliverContainer = () => `
  <div class="bash--delivery-container" data-view="select-address">
  
  <section class="bash--delivery-view" data-section="select-address">
     <div class="bash--heading">
        <h2>Delivery address</h2>
        <a href="#" data-view="address-search">Add address</a>
      </div>
      ${Addresses()}
      <div class="bash--heading">
        <h2>[ Extra fields ]</h2>
      </div>
      <div id="bash--extra-fields">For furniture, tv, etc.</div>

      <div class="bash--heading">
        <h2>Delivery method</h2>
        <a href="#" data-view="address-search">Furniture shipping costs</a>
      </div>
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
