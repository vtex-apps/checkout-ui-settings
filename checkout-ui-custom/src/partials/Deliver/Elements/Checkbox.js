const Checkbox = ({ name, label, checked, value }) => `
    <label class="tfg-checkbox-label">
       <input 
        type='checkbox' 
        name="${name}" 
        id="bash--input-${name}"
        ${checked ? "checked='checked'" : ''}
        value=${value ?? ''}
      />
      <span>${label}</span>
    </label>
  `;

export default Checkbox;
