import Radio from './Elements/Radio';

const DeliveryOptions = () => `
  <label class="bash--delivery-option-display" >
  ${Radio({
    name: 'delivery-option',
    options: [{ checked: true, value: true }],
  })}
   
   <div id="bash--delivery-option-text" class="bash--delivery-option-text">
      <span class="normal-delivery">Deliver within 3 - 5 days</span>
   </div>

  <div id="bash--delivery-fee" class="bash--delivery-fee">
    R50
  </div>
</label>
  `;

export default DeliveryOptions;
