// message: string

export const AlertContainer = () => '<div id="bash-alert-container"></div>';

export const Alert = ({ text }) => `<div class='alert-container'>
      <p>${text}</p>
    </div>
  `;

export default AlertContainer;
