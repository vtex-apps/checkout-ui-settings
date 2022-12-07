const DropDown = ({ name, disabled = false, options }) => `
  <select name="${name}" ${disabled ? ' disabled ' : ''} id="bash--dropdown-${name}" class="input-large" >
    ${options.map(
      ({ value, label, selected }) => `
      <option 
        value="${value}" 
        ${selected ? ' selected ' : ''}
      >${label}</option>
      `
    )}
  </select>
  `;

export default DropDown;
