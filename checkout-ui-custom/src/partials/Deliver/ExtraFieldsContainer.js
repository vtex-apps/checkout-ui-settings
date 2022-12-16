import FurnitureForm from './FurnitureForm';
import RICAForm from './RICAForm';
import TVLicenseForm from './TVLicenseForm';

const ExtraFieldsContainer = ({ hasFurn, hasTV, hasSim }) => {
  const showFurnitureForm = `
    <div id="furniture-form">
      <hr>
      <div class="bash--heading">
        <h2>Furniture information needed</h2>
      </div>
      <p class="tfg-custom-subtitle">
        We need some more information to prepare delivery of your furniture items to your address.
        <br>
        <br>
        Please ensure sufficient space to receive the goods and keep in mind 
        that our couriers aren't able to hoist goods onto balconies.
      </p>
      ${FurnitureForm()}
    </div>
  `;

  const showTVLicenseForm = `
    <div id="tv-license-form">
      <hr>
      <div class="bash--heading" style="flex-direction: column; align-items: flex-start;">
        <h3>TV license information needed</h3>
        <p class="tfg-custom-subtitle">Please provide your ID number to validate your TV Licence.</p>
      </div>
      ${TVLicenseForm()}
    </div>
  `;

  const showRICAForm = `
    <div id="rica-form">
      <hr>
      <div class="bash--heading" style="flex-direction: column; align-items: flex-start;">
        <h3>Rica information required</h3>
        <p class="tfg-custom-subtitle">
          To RICA your SIM card, provide your SA ID (or foreign passport) number and your address as
          it appears on a valid proof of residence.
        </p> 
      </div>
        ${RICAForm()}
    </div>
    `;

  return `
  <section class="bash--extra-fields bash--delivery-view" data-section="select-address">
    ${hasFurn ? showFurnitureForm : ''}
    ${hasTV ? showTVLicenseForm : ''}
    ${hasSim ? showRICAForm : ''}
  </section>`;
};

export default ExtraFieldsContainer;
