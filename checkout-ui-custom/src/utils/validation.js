export const validatePhoneNumber = (tel) => {
  if (!tel) return false;
  tel = tel.replace(/\s/g, '');
  // Numbers only, 9 digits or longer.
  return tel.match(/[0-9]{9,}/);
};

export const preparePhoneField = (input) => {
  const phoneInput = document.querySelector(input);
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('maxlength', 12);
  phoneInput.setAttribute('placeholder', 'xxx xxx xxxx');

  const $phoneInput = $(input);
  $phoneInput.keyup((e) => {
    const value = e.currentTarget.value.replace(/[^0-9+*#]+/g, '').trim();
    let displayValue = value;

    if (value.length > 6) {
      // 'xxx xxx *'
      displayValue = [value.slice(0, 3), value.slice(3, 6), value.slice(6)].join(' ');
    } else if (value.length > 3) {
      // 'xxx *'
      displayValue = [value.slice(0, 3), value.slice(3)].join(' ');
    }

    $phoneInput.parent('.text').removeClass('error');
    $phoneInput.parent('.text').find('span.error').hide();
    $phoneInput.val(displayValue);
  });
};

export default { validatePhoneNumber };
