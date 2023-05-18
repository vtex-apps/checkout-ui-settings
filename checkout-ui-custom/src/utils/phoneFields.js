/**
 * validatePhoneNumber
 * Determine if number is valid.
 * Numbers and spaces only, 9 digits or longer.
 * @param tel - string
 * @returns boolean
 */
export const validatePhoneNumber = (tel) => {
  if (!tel) return false;
  tel = tel.replace(/\s/g, '');

  if (tel[0] === '0') return tel.match(/[0-9\s]{10}/);

  return tel.match(/[0-9\s]{9,}/);
};
/**
 * formattedPhoneNumber
 * Add spaces to help guide the user how the number should look.
 * Adds space after 3rd and 6th digits only.
 * xxx xxx xxxxxxxxx
 * @param value - string value
 * @returns string
 */
const formattedPhoneNumber = (value, doFormat = true) => {
  value = value.replace(/[^0-9+*#]+/g, '').trim();

  // 'xxx xxx *'
  if (value.length >= 6 && doFormat) {
    return [value.slice(0, 3), value.slice(3, 6), value.slice(6)].join(' ');
  }
  // 'xxx *'
  if (value.length >= 3 && doFormat) {
    return [value.slice(0, 3), value.slice(3)].join(' ');
  }

  return value;
};

/**
 * preparePhoneField
 * When phone fields are loaded onto the DOM
 * Prepare them for proper display and validation.
 *
 * @param  input - string css selector to the element.
 */
export const preparePhoneField = (input) => {
  const phoneInput = document.querySelector(input);
  if (!phoneInput) return;
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('maxlength', 12);
  phoneInput.value = formattedPhoneNumber(phoneInput.value);

  const $phoneInput = $(input);
  $phoneInput.keyup((e) => {
    const value = e.currentTarget.value.replace(/[^0-9+*#]+/g, '').trim();
    let displayValue = value;

    const isBackSpace = e.keyCode === 8;
    displayValue = formattedPhoneNumber(value, !isBackSpace);

    $phoneInput.parent('.text').removeClass('error');
    $phoneInput.parent('.text').find('span.error').hide();
    $phoneInput.val(displayValue);
  });
};

export const getBestPhoneNumber = ({ preferred = undefined, type = 'profile', fields }) => {
  if (type === 'collect') {
    return preferred || fields?.phone
      || document?.getElementById('client-phone')?.value
      || window.vtexjs.checkout.orderForm?.clientProfileData?.phone
      || '';
  }

  return (preferred
    || window.vtexjs.checkout.orderForm?.clientProfileData?.phone
    || document?.getElementById('client-phone')?.value
    || ''
  );
};

// some presaved addresses still have a missing zero,
// this adds a zero to the phone number, if it's not there.
export const prependZero = (tel) => {
  if (!tel) return '';
  let phoneNumber = tel.replace(/\s/g, '');
  if (phoneNumber.length === 9 && phoneNumber[0] !== '0') {
    phoneNumber = `0${phoneNumber}`;
  }

  return phoneNumber;
};

// add spaces between 3rd and 6th digit
export const formatPhoneNumber = (value) => [value.slice(0, 3), value.slice(3, 6), value.slice(6)].join(' ');

export default { validatePhoneNumber };
