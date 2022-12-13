import FurnitureForm from './FurnitureForm';
import RICAForm from './RICAForm';
import TVLicenseForm from './TVLicenseForm';

const ExtraFieldsContainer = ({ hasFurn, hasTV, hasSim }) => {
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
  <div id="bash--extra-fields">
    ${hasFurn ? showFurnitureForm : '<div></div>'}
    ${hasTV ? showTVLicenseForm : '<div></div>'}
    ${hasSim ? showRICAForm : '<div></div>'}
  </div>`;
};

export default ExtraFieldsContainer;
