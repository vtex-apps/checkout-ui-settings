export const validatePhoneNumber = (tel) => {
  if (!tel) return false;
  tel = tel.replace(/\s/g, '');
  // Numbers only, 9 digits or longer.
  return tel.match(/[0-9]{9,}/);
};

export default { validatePhoneNumber };
