const Checkbox = ({ name, label, checked }) => `
 
  <p class="tfg-custom-checkbox">
    <label class="tfg-checkbox-label">
       <input 
        type='checkbox' 
        name="${name}" 
        id="bash--input-${name}" ${checked ? "checked='checked'" : ''}
        value="true" 
        /> ${label}</label>
  </p>
  `;

export default Checkbox;
