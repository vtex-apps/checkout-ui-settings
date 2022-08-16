// Checkout steps
const STEPS = {
  CART: '#/cart',
  PROFILE: '#/profile',
  SHIPPING: '#/shipping',
  PAYMENT: '#/payment'
};

// Errors
const ERRORS = {
  DEFAULT: 'This field is required.',
  PHONE: 'Enter a valid phone number.',
  EMAIL: 'Enter a valid email address.'
};

// Address types
const AD_TYPE = {
  PICKUP: 'search',
  DELIVERY: 'residential'
};

// TIMEOUT
const TIMEOUT_500 = 500;
const TIMEOUT_750 = 750;

// APP CONFIGURATION IDs
const RICA_APP = 'ricafields';
const TV_APP = 'tvfields';
const FURNITURE_APP = 'furniturefields';

// Furniture fees Url
const FURNITURE_FEES = 'http://image.tfgmedia.co.za/image/1/process/500x790?source=http://cdn.tfgmedia.co.za'
  + '/15/Marketing/HTMLPages/Furniture_Delivery_Fees_tab_image.jpg';

const COUNTRIES = {
  za: { code: 'za', phonePlaceholder: '(+27)' } // South Africa
};
const COUNTRIES_AVAILABLES = [COUNTRIES.za.code];

const BASE_URL_API = `${window.location.protocol}//${window.location.host}/custom-api/`;

export {
  STEPS,
  TIMEOUT_500,
  TIMEOUT_750,
  RICA_APP,
  FURNITURE_FEES,
  COUNTRIES,
  COUNTRIES_AVAILABLES,
  AD_TYPE,
  BASE_URL_API,
  TV_APP,
  FURNITURE_APP,
  ERRORS
};
