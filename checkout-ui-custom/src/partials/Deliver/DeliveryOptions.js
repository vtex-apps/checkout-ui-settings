/* eslint-disable no-nested-ternary */
import Radio from './Elements/Radio';
import FurnitureDeliveryOptions from './FurnitureDelivery';

const DeliveryOptions = ({ hasFurnOnly, hasFurnitureMixed }) => {
  let deliveryMessage = 'Delivery within 3 - 5 working days';

  if (hasFurnitureMixed) deliveryMessage = 'Delivery within 3 - 10 working days';
  if (hasFurnOnly) deliveryMessage = 'Delivery within 5 - 10 working days';

  // Update the message in the Delivery Summary.
  $('.shp-summary-package-time > span').html(deliveryMessage);

  return `
  <label class="bash--delivery-option-display" >
  ${Radio({
    name: 'delivery-option',
    options: [{ checked: true, value: true }],
  })}
   
   <div id="bash--delivery-option-text" class="bash--delivery-option-text">
      <span class="normal-delivery">
        ${deliveryMessage}
      </span>
   </div>

  <div id="bash--delivery-fee" class="bash--delivery-fee">
    R50
  </div>
</label>

${FurnitureDeliveryOptions()}
  `;
};

export default DeliveryOptions;
