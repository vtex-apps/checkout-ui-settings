import FormField from './Elements/FormField';

const TVLicenseForm = () => {
  const field = {
    name: 'tvLicense',
    label: 'SA ID number',
    required: true,
    value: '',
  };

  return `
    ${FormField(field)}
  `;
};

export default TVLicenseForm;
