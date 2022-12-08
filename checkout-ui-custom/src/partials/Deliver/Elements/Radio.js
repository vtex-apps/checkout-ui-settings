const Radio = ({ name, options = [] }) => `
  
  <div class="bash--radio-options">
  ${options
    .map(
      ({ value, label, checked = false, disabled = false }) => `
      <label class="bash--radio-option" id="radio-label-${name}-${value}">
        <input type="radio" 
          ${checked ? "checked='checked'" : ''} 
          ${disabled ? "disabled='disabled'" : ''} 
          value="${value ?? ''}" 
          name="${name}" 
          id="radio-${name}-${value}"
        />
          <span class="radio-icon"></span> 
          ${label ? `<span class="radio-label">${label}</span>` : ''}
      </label>
    `
    )
    .join('')}
   
  </div>
  `;

export default Radio;
