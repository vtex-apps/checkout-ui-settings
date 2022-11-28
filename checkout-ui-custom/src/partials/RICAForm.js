const RICAForm = () => `
  <div id="tfg-custom-rica-msg" class="tfg-custom-step">
    <p class="tfg-custom-title">RICA information required</p>
    <p class="tfg-custom-subtitle">
      To RICA your SIM card, provide your SA ID (or foreign passport) number and your address as
      it appears on a valid proof of residence.
    </p>
    <p class="input tfg-custom-input tfg-rica-id-passport">
      <label>ID or passport number</label>
      <input id="tfg-rica-id-passport" type="text" class="input-xlarge tfg-input">
    </p>
    <label class="tfg-mtop10">Proof of residential address</label>
    <p class="tfg-custom-checkbox">
      <label class="tfg-checkbox-label">
        <input type='checkbox' id="tfg-rica-same-address" checked/>
        <span class="tfg-checkbox-text">Residential address the same as Delivery address</span>
      </label>
    </p>
    <p class="input tfg-custom-input tfg-rica-fullname">
      <label>Full name and surname</label>
      <input id="tfg-rica-fullname" type="text" class="input-xlarge tfg-input rica-field">
    </p>
    <p class="input tfg-custom-input tfg-rica-street">
      <label>Street address</label>
      <input id="tfg-rica-street" type="text" class="input-xlarge tfg-input rica-field">
    </p>
    <p class="input tfg-custom-input tfg-rica-suburb">
      <label>Suburb</label>
      <input id="tfg-rica-suburb" type="text" class="input-xlarge tfg-input rica-field">
    </p>
    <p class="input tfg-custom-input tfg-rica-city">
      <label>City</label>
      <input id="tfg-rica-city" type="text" class="input-xlarge tfg-input rica-field">
    </p>
    <p class="input tfg-custom-input tfg-rica-postal-code">
      <label>Postal code</label>
      <input id="tfg-rica-postal-code" type="text" class="input-xlarge tfg-input rica-field">
    </p>
    <p class="input tfg-rica-province tfg-custom-input">
      <label>Province</label>
      <select class="input-xlarge tfg-custom-selector rica-field" id="tfg-rica-province">
        <option value="" disabled selected>State</option>
        <option value="EC">Eastern Cape</option>
        <option value="FS">Free State</option>
        <option value="GP">Gauteng</option>
        <option value="KZN">KwaZulu-Natal</option>
        <option value="LP">Limpopo</option>
        <option value="MP">Mpumalanga</option>
        <option value="NC">Northern Cape</option>
        <option value="NW">North West</option>
        <option value="WC">Western Cape</option>
      </select>
    </p>
    <p class="input tfg-rica-country tfg-custom-input">
      <label>Country</label>
      <select class="input-xlarge tfg-custom-selector" id="tfg-rica-country" disabled>
        <option value="ZAF" selected>South Africa</option>
      </select>
    </p>
  </div>
`;

export default RICAForm;
