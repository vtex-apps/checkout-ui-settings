/* eslint-disable no-nested-ternary */
import Radio from './Elements/Radio';
import FurnitureDeliveryOptions from './FurnitureDelivery';

const RadioButton = () => Radio({
  name: 'delivery-option',
  options: [{ checked: true, value: true }],
});

const DeliveryOptions = () => `
  <label class="bash--delivery-option-display" >
  ${RadioButton()}
   <div id="bash--delivery-option-text"  class="bash--delivery-option-text">
      <span class="normal-delivery normal-delivery-period">
        Deliver within 3 - 5 working days
      </span>
      <span class="furniture-delivery furniture-delivery-period">
        Deliver within 5 - 10 working days
      </span>
      <span class="furniture-mixed-delivery-period">
        Deliver within 3 - 10 working days
      </span>
   </div>

  <div id="bash--delivery-fee" class="bash--delivery-fee">
    R50
  </div>
</label>

${FurnitureDeliveryOptions()}
  `;

/*
<div id="bash--delivery-option-text" class="bash--delivery-option-text">
    <span class="normal-delivery">
      Deliver within ${hasFurnitureMixed ? '3 - 10' : hasFurnOnly ? '5 - 10' : '3 - 5'} working days
    </span>
*/
export default DeliveryOptions;
