// Checkout steps
const STEPS = {
  CART: '#/cart',
  PROFILE: '#/profile',
  SHIPPING: '#/shipping',
  PAYMENT: '#/payment'
};

// TIMEOUT
const TIMEOUT_500 = 500;
const TIMEOUT_750 = 750;

const RICA_APP = 'ricafields';

// Furniture fees Url
const FURNITURE_FEES = 'http://image.tfgmedia.co.za/image/1/process/500x790?source=http://cdn.tfgmedia.co.za'
  + '/15/Marketing/HTMLPages/Furniture_Delivery_Fees_tab_image.jpg';

const COUNTRIES = {
  za: { code: 'za', phonePlaceholder: '(+27)' } // South Africa
};
const COUNTRIES_AVAILABLES = [COUNTRIES.za.code];

export {
  STEPS,
  TIMEOUT_500,
  TIMEOUT_750,
  RICA_APP,
  FURNITURE_FEES,
  COUNTRIES,
  COUNTRIES_AVAILABLES
};
