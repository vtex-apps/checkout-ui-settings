const AlertBox = (message, type) => `
  <div id="tfg-custom-${type}-msg" class="tfg-custom-msg">
    <p class="tfg-custom-icon"></p>
    <p class="tfg-custom-text">${message}</p>
  </div>
`;

export default AlertBox;
