const AddressForm = () => `<p class="input custom-field-receiverName tfg-custom-addressForm">
      <label>Recipient</label>
      <input id="custom-field-receiverName" class="input-xlarge success" type="text" field="receiverName" />
    </p>
    <p class="input custom-field-complement tfg-custom-addressForm">
      <label>Mobile number</label>
      <input id="custom-field-complement" class="input-xlarge success" type="text" field="complement"/>
    </p>
    <p class="input custom-field-companyBuilding tfg-custom-addressForm">
      <label>Company/Building</label>
      <input id="custom-field-companyBuilding" class="input-xlarge success" type="text" field="companyBuilding"/>
    </p>
  `;

export const SuburbField = () => `<p class="input custom-field-neighborhood tfg-custom-addressForm">
<label>Suburb</label>
<input id="custom-field-neighborhood" class="input-xlarge success" type="text" field="neighborhood"/>
</p>`;

export const PickupComplementField = () => `
  <p id="box-pickup-complement" class="input custom-field-complement tfg-custom-addressForm">
    <label>Mobile number</label>
    <input id="custom-pickup-complement" class="input-xlarge success" type="text" field="complement"/>
  </p>`;

export default AddressForm;
