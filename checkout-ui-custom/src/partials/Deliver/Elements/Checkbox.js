const Checkbox = ({ name, label, checked }) => `
  <label class="tfg-checkbox-label">${label}</label>
  <p class="tfg-custom-checkbox">
      <input type='checkbox' id="tfg-rica-same-address" checked=${checked}/>
      <span class="tfg-checkbox-text">${name}</span>
  </p>
  `;

export default Checkbox;
