import CollectController from './controller/CollectController';
import DeliverController from './controller/DeliverController';
import ViewController from './controller/ViewController';

const script = document.createElement('script');
script.setAttribute('src', 'https://unpkg.com/penpal@^6/dist/penpal.min.js');
document.head.appendChild(script);

ViewController.init();
CollectController.init();
DeliverController.init();
