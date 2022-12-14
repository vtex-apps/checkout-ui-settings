import { FURNITURE_FEE_LINK } from '../../utils/const';
import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';

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
        <h2>Delivery address</h2>
        <a href="#" data-view="address-search">&lt; Back</a>
      </div>
      ${AddressForm()}
    </section>

   <form name="bash-delivery-form" method="post">

    <section id="bash-delivery-options" class="shipping-method bash--delivery-view" data-section="select-address">
      <hr>
      <div class="bash--heading">
        <h2>Delivery options</h2>
        ${hasFurn ? FURNITURE_FEE_LINK : ''}
      </div>
      <button 
        class="submit btn-go-to-payment btn btn-large btn-success"
        id="btn-save-delivery" 
        type="submit"a>
        Go to payment
      </button>
    </section>

   </form>
   
  </div>`;

export default DeliverContainer;
