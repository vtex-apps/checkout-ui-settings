import RICAForm from './RICAForm';
import TVLicenseForm from './TVLicenseForm';

const ExtraFieldsContainer = ({ hasTV, hasSim }) => {
  const showTVLicenseForm = `
    <div id="tv-license-form">
      <hr>
      <div class="bash--heading sub-heading heading-with-description">
        <h3>TV license information needed</h3>
        <p class="tfg-custom-subtitle">Please provide your ID number to validate your TV Licence.</p>
      </div>
      ${TVLicenseForm()}
    </div>
  `;

  const showRICAForm = `
    <div id="rica-form">
      <hr>
      <div class="bash--heading sub-heading heading-with-description">
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
    ${hasTV ? showTVLicenseForm : ''}
    ${hasSim ? showRICAForm : ''}
  </section>`;
};

export default ExtraFieldsContainer;
