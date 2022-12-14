import FormField from './Elements/FormField';

const TVLicenseForm = () => {
  const field = {
    name: 'tvLicense',
    label: 'SA ID number',
    required: true,
    value: '',
  };

  return `
  <form id="bash--address-form" method="post">
    ${FormField(field)}
  </form>
  `;
};

export default TVLicenseForm;
