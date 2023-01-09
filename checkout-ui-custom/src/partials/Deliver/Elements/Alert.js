// message: string

export const AlertContainer = () => '<div id="bash-alert-container"></div>';

export const Alert = ({ text }) => `<div class='alert-container'>
      <div class="alert-content">
        <p>${text}</p>
      </div>
    </div>
  `;

export default AlertContainer;
