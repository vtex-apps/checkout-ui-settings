import CollectController from './controller/CollectController';
import DeliverController from './controller/DeliverController';
import ViewController from './controller/ViewController';
import sendEvent from './utils/sendEvent';

const script = document.createElement('script');
script.setAttribute('src', 'https://unpkg.com/penpal@^6/dist/penpal.min.js');
document.head.appendChild(script);

const loadScripts = async () => {
  let isLoaded = window?.vtexjs?.checkout?.orderForm;

  try {
    if (!isLoaded) {
      isLoaded = await window.vtexjs.checkout.getOrderForm();
    }

    if (isLoaded) {
      ViewController.init();
      CollectController.init();
      DeliverController.init();
    }
  } catch (e) {
    console.error('VTEX_ORDERFORM_ERROR: Could not load at custom-shipping-steps Entry Point', e);
    sendEvent({
      eventCategory: 'Checkout_SystemError',
      action: 'OrderFormFailed',
      label: 'Could not getOrderForm() from vtex',
      description: 'Could not load orderForm on custom-shipping-steps Entry Point'
    });

    ViewController.init();
    CollectController.init();
    DeliverController.init();
  }
};

document.addEventListener('DOMContentLoaded', loadScripts);
