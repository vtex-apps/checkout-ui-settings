const Checkbox = ({ name, label, checked }) => `
    <label class="tfg-checkbox-label">
       <input 
        type='checkbox' 
        name="${name}" 
        id="bash--input-${name}" ${checked ? "checked='checked'" : ''}
        value="true" 
        /> <span>${label}</span> </label>
  `;

export default Checkbox;
