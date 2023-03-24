/* eslint-disable no-nested-ternary */
import Radio from './Elements/Radio';

const DeliveryOptions = ({ hasFurnOnly, hasFurnitureMixed }) => `
  <label class="bash--delivery-option-display" >
  ${Radio({
    name: 'delivery-option',
    options: [{ checked: true, value: true }],
  })}
   
   <div id="bash--delivery-option-text" class="bash--delivery-option-text">
      <span class="normal-delivery">
        Deliver within ${hasFurnitureMixed ? '3 - 10' : hasFurnOnly ? '5 - 10' : '3 - 5'} working days
      </span>
   </div>

  <div id="bash--delivery-fee" class="bash--delivery-fee">
    R50
  </div>
</label>
  `;

export default DeliveryOptions;
