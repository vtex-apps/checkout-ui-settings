// // import AddressController from './controller/AddressController';
var script = document.createElement('script');
script.setAttribute('src','https://unpkg.com/penpal@^6/dist/penpal.min.js');
document.head.appendChild(script);

import CollectController from './controller/CollectController';
import DeliverController from './controller/DeliverController';
import FormController from './controller/FormController';
import ViewController from './controller/ViewController';

// // AddressController.init();
ViewController.init();
FormController.init();
CollectController.init();
DeliverController.init();
