import Addresses from './Addresses';
import AddressForm from './AddressForm';
import AddressSearch from './AddressSearch';
import FurnitureForm from './FurnitureForm';
import RICAForm from './RICAForm';
import TVLicenseForm from './TVLicenseForm';

const DeliverContainer = ({ hasFurn, hasTV, hasSim }) => {
  const showFurnitureForm = `
    <section class="bash--delivery-view" data-section="furniture-fields">
      <div class="bash--heading">
        <h3>Furniture information needed</h3>
      </div>
      <p class="tfg-custom-subtitle">
        We need some more information to prepare delivery of your furniture items to your address.
      </p>
      ${FurnitureForm()}
    </section>
  `;

  const showTVLicenseForm = `
    <section class="bash--delivery-view" data-section="tv-fields">
      <div class="bash--heading">
        <h3>TV license information needed</h3>
        <p class="tfg-custom-subtitle">Please provide your ID number to validate your TV Licence.</p>
      </div>
      ${TVLicenseForm()}
    </section>
  `;

  const showRICAForm = `
    <section class="bash--delivery-view" data-section="rica-fields">
      <div class="bash--heading">
        <h3>Rica information required</h3>
        <p class="tfg-custom-subtitle">
          To RICA your SIM card, provide your SA ID (or foreign passport) number and your address as
          it appears on a valid proof of residence.
        </p>
        ${RICAForm()}
      </div>
    </section>
  `;

  return `
    <div class="bash--delivery-container" data-view="select-address">
    
      <section class="bash--delivery-view" data-section="select-address">
      <div class="bash--heading">
          <h2>Delivery address</h2>
          <a href="#" data-view="address-search">Add address</a>
        </div>
        ${Addresses()}

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

      <div class="bash--heading">
          <h2>Extra fields</h2>
      </div>
      <div id="bash--extra-fields">
        ${hasFurn ? showFurnitureForm : '<div></div>'}
        ${hasTV ? showTVLicenseForm : '<div></div>'}
        ${hasSim ? showRICAForm : '<div></div>'}
      </div>

      <section class="bash--delivery-view" data-section="complete-address">
        <h2>Complete address</h2>
        <a href="#" data-view="select-address">&lt; Back</a>
      </section>

      <section class="bash--delivery-view" data-section="edit-address">
        <h2>Edit address</h2>
        <a href="#" data-view="select-address">&lt; Back</a>
      </section>
      
    </div>`;
};

export default DeliverContainer;
