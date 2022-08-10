export const validatePhoneNumber = (tel) => {
  if (!tel) return false;
  tel = tel.replace(/\s/g, '');
  return tel.match(/([0-9]){9+}/);
};

export default { validatePhoneNumber };
