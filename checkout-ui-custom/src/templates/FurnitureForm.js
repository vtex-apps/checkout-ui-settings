const FurnitureForm = ({ buildingType, parkingDistance, deliveryFloor, liftStairs }) => {
  // Building type selector
  let buildingTypeInput = `
    <p class="input tfg-custom-input tfg-building-type">
      <label>Building type</label>
      <select class="input-xlarge tfg-custom-selector" id="tfg-building-type">
        <option disabled selected value="">Please select</option>
    `;

  buildingType.forEach((value) => {
    buildingTypeInput += `<option value="${value}">${value}</option>`;
  });

  buildingTypeInput += `
      </select>
    </p>
    `;

  // Parking selector
  let parkingDistanceInput = `
  <p class="input tfg-custom-input tfg-parking-distance">
    <label>Distance to parking</label>
    <select class="input-xlarge tfg-custom-selector" id="tfg-parking-distance">
      <option disabled selected value="">Please select</option>
  `;

  parkingDistance.forEach((value) => {
    parkingDistanceInput += `<option value="${value}">${value}</option>`;
  });

  parkingDistanceInput += `
    </select>
  </p>
  `;

  // Delivery floor selector
  let deliveryFloorInput = `
  <p class="input tfg-custom-input tfg-delivery-floor">
    <label>Delivery floor</label>
    <select class="input-xlarge tfg-custom-selector" id="tfg-delivery-floor">
      <option disabled selected value="">Please select</option>
  `;

  deliveryFloor.forEach((value) => {
    deliveryFloorInput += `<option value="${value}">${value}</option>`;
  });

  deliveryFloorInput += `
    </select>
  </p>
  `;

  // Lift/Stairs selector
  let liftStairsInput = `
  <p class="input tfg-custom-input tfg-lift-stairs">
    <label>Lift or stairs</label>
    <select class="input-xlarge tfg-custom-selector" id="tfg-lift-stairs">
      <option disabled selected value="">Please select</option>
  `;

  liftStairs.forEach((value) => {
    liftStairsInput += `<option value="${value}">${value}</option>`;
  });

  liftStairsInput += `
    </select>
  </p>
  `;

  // Complete Form
  return `
    <div id="tfg-custom-furniture-step" class="tfg-custom-step">
      <p class="tfg-custom-title">Furniture information needed</p>
      <p class="tfg-custom-subtitle">
        We need some more information to prepare delivery of your furniture items to your address.
      </p>
      ${buildingTypeInput}
      ${parkingDistanceInput}
      ${deliveryFloorInput}
      ${liftStairsInput}
      <p class="tfg-custom-checkbox">
        <label class="tfg-checkbox-label">
          <input type='checkbox' id="tfg-sufficient-space"/>
          <span class="tfg-checkbox-text">Is there sufficent corner/passage door space?</span>
        </label>
      </p>
      <p class="tfg-custom-checkbox">
        <label class="tfg-checkbox-label">
          <input type='checkbox' id="tfg-assemble-furniture"/>
          <span class="tfg-checkbox-text">Would you like us to assemble your furniture items?</span>
        </label>
      </p>
    </div>
  `;
};

export default FurnitureForm;
