import FormField from './Elements/FormField';

// TODO pass address?
const AddressForm = () => {
  console.info('Address form');

  const fields = [
    {
      name: 'receiverName',
      label: 'Recipient’s name',
      required: true,
      value: 'Fred',
    },
    {
      name: 'complement',
      label: 'Recipient’s mobile number',
      required: true,
      value: '072 123 4567',
      type: 'tel',
    },
    {
      name: 'addressType',
      label: 'Address type',
      required: false,
      type: 'radio',
      options: [
        { value: 'residential', label: 'Residential', checked: true },
        { value: 'business', label: 'Business' },
      ],
    },

    {
      name: 'number',
      label: 'Building/Complex and number',
      required: false,
      value: '6 Kenilworth Vlg',
    },
    {
      name: 'street',
      label: 'Street address',
      required: true,
      value: '7 Punters Way',
    },
    {
      name: 'neighborhood',
      label: 'Suburb',
      required: true,
      value: 'Kenilworth',
    },
    {
      name: 'postalCode',
      label: 'Postal code',
      required: true,
      value: '7708',
      type: 'tel',
      minlength: 4,
      maxLength: 4,
    },
    // TODO Province Dropdown
  ];

  const formFields = fields.map((field) => FormField(field)).join('');

  return `
  <form id="bash--address-form" method="post">
    ${formFields}
  </form>
  
  `;
};

export default AddressForm;
