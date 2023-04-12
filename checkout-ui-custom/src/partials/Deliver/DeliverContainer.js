import { FURNITURE_FEE_LINK } from '../../utils/const';
import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';
import { DeliveryErrorContainer } from './DeliveryError';
import DeliveryOptions from './DeliveryOptions';
import { AlertContainer } from './Elements/Alert';
import MixedProducts from './MixedProducts';
import TVorRICAMsg from './TVorRICAMsg';

const DeliverContainer = ({ hasFurn, hasFurnOnly, hasFurnMixed }) => `
  <div class="bash--delivery-container ${hasFurn && 'has-furniture'}"
   id="bash--delivery-container" data-view="select-address">
    <div id="bash--shipping-messages">
      ${AlertContainer()}
      ${TVorRICAMsg()}
      ${MixedProducts()}
      ${DeliveryErrorContainer()}
    </div>
   <form id="bash--delivery-form" name="bash--delivery-form" method="post">

    <section class="bash--delivery-view" data-section="select-address">
    <div class="bash--heading">
        <h2>Delivery address</h2>
        <a href="#" data-view="address-search">Add address</a>
      </div>
      ${Addresses()}
    </section>

    <section id="bash-delivery-options" class="shipping-method bash--delivery-view" data-section="select-address">
      <hr>
      <div class="bash--heading sub-heading">
        <h3>Delivery method</h3>
        ${hasFurnOnly || hasFurnMixed ? FURNITURE_FEE_LINK : ''}
      </div>
      ${DeliveryOptions({ hasFurnOnly, hasFurnitureMixed: hasFurnMixed })}
      <button 
        class="submit btn-go-to-payment btn btn-large btn-success"
        id="btn-save-delivery" 
        type="submit">
          Go to payment
      </button>
    </section>
   </form>

    <section class="bash--delivery-view" data-section="address-search">
      <div class="bash--heading">
        <h3>Add a new delivery address</h3>
        <a href='#' data-view='select-address' id='back-button-select-address'>&lt; Back</a>
      </div>
      <div class="address-search-field-container" id="address-search-field-container">
          ${AddressSearch()} 
      </div>
      <p style="font-size: 12px; margin: 16px 0" id="type-your-address-above">
        Type your address above or 
        <a 
          href="" id="link-manual-address-entry"
          data-view="address-form"
          onClick="document.getElementById('bash--input-street').focus()"
          style="text-decoration: underline" 
        >enter it manually</a>.
      </p>
    </section>
    
    <section class="bash--delivery-view" data-section="address-form">
       <div class="bash--heading">
        <h3>Delivery address</h3>
        <a href="#" class="back-button--search" data-view="address-search">&lt; Back</a>
        <a href="#" class="back-button--select" data-view="select-address">&lt; Back</a>
      </div>
      ${AddressForm()}
    </section>
    
  </div>`;

export default DeliverContainer;
