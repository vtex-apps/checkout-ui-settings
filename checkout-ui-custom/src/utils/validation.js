export const validatePhoneNumber = (tel) => {
  if (!tel) return false;
  tel = tel.replace(/\s/g, '');
  // Numbers only, 9 digits or longer.
  return tel.match(/[0-9]{9,}/);
};

export const preparePhoneField = (input) => {
  const phoneInput = document.querySelector(input);
  phoneInput.setAttribute('type', 'tel');
  phoneInput.setAttribute('maxlength', 10);
  phoneInput.setAttribute('placeholder', '');

  const $phoneInput = $(input);
  $phoneInput.keyup((e) => {
    const filteredValue = e.currentTarget.value.replace(/[^0-9.]+/g, '');
    $phoneInput.parent('.text').removeClass('error');
    $phoneInput.parent('.text').find('span.error').hide();
    $phoneInput.val(filteredValue);
  });
};

export default { validatePhoneNumber };
