const Checkbox = ({ name, label, checked }) => `
  <div class="bash--checkbox">
    <label class="bash-checkbox-label">${label}</label>
    <p class="bash-custom-checkbox">
        <input
          class='bash-checkbox-input'
          type='checkbox'
          id="bash-rica-same-address"
          ${checked ? "checked='checked'" : ''}
        />
        <span class="bash-checkbox-text">${name}</span>
    </p>
  </div>
`;

export default Checkbox;
