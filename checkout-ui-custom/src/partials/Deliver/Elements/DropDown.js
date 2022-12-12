const DropDown = ({ name, disabled = false, options, required }) => {
  const hasASelectedOption = options.find((option) => option.selected === true);

  return `
  <select 
    name="${name}" 
    ${required ? ' required ' : ''} 
    ${disabled ? ' disabled ' : ''} 
    id="bash--input-${name}" 
    class="input-large" 
  >
  ${options
    .map(
      ({ value, label, selected }, index) => `
    <option 
    ${index === 0 ? ' disabled ' : ''}
    ${index === 0 && !hasASelectedOption ? ' selected ' : ''}
    ${selected ? ' selected ' : ''}
      value="${value}" 
    >${label}</option>
    `
    )
    .join('')}
  </select>
  `;
};

export default DropDown;
