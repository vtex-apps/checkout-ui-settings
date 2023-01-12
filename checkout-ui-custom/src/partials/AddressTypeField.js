const AddressTypeField = (type = 'residential') => `
<div class="input ship-addressType text" style="order: 3;">
   <label>Address type</label>
    <div class="ship-addressType-container">
      <div class="ship-addressType-div-residential">
          <input type="radio" 
            id="ship-addressType-residential" 
            name="ship-addressType" value="residential"
            ${type === 'residential' ? ' checked="checked" ' : ''}
            >
          <label for="ship-addressType-residential">Residential</label>
      </div>
      <div class="ship-addressType-div-business"> 
          <input type="radio" 
            id="ship-addressType-business" 
            name="ship-addressType" value="commercial"
            ${type === 'commercial' ? ' checked="checked" ' : ''} 
             >
          <label for="ship-addressType-business">Business</label>
      </div>
    </div>
</div>`;

export default AddressTypeField;
