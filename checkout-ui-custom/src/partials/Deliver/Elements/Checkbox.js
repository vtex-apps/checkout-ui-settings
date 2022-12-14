const Checkbox = ({ name, label, checked }) => `
 
  <p class="tfg-custom-checkbox">
    <label class="tfg-checkbox-label">
       <input 
        type='checkbox' 
        name="${name}" 
        id="tfg-rica-same-address" ${checked ? "checked='checked'" : ''} /> ${label}</label>
  </p>
  `;

export default Checkbox;
