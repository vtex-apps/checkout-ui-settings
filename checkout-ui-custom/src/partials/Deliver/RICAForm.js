import FormField from './Elements/FormField';

const RICAForm = () => {
  const {
    shippingData: { selectedAddress },
  } = window.vtexjs.checkout.orderForm;

  const fields = [
    {
      name: 'ricaIdPassport',
      label: 'ID or Passport number',
      required: true,
      value: '',
    },
    {
      name: 'Residential address the same as delivery address',
      label: 'Proof of residential address',
      type: 'checkbox',
      checked: true,
    },
    // for rest of the fields check if
    // same as residential address is checked?
    // if checked prefill the fields otherwise don't
    {
      name: 'nameAndSurname',
      label: 'Full name and surname',
      required: true,
      value: selectedAddress?.receiverName || '',
    },
    {
      name: 'street',
      label: 'Street address',
      required: true,
      value: selectedAddress?.street || '',
    },
    {
      name: 'neighborhood',
      label: 'Suburb',
      value: selectedAddress?.neighborhood || '',
    },
    {
      name: 'city',
      label: 'City',
      required: true,
      value: selectedAddress?.city || '',
    },
    {
      name: 'postalCode',
      label: 'Postal code',
      value: selectedAddress?.postalCode || '',
      type: 'tel',
      minlength: 4,
      maxLength: 4,
    },
    {
      name: 'state',
      label: 'Province',
      type: 'dropdown',
      options: [
        {
          value: '',
          label: 'Select',
        },
        {
          value: 'EC',
          label: 'Eastern Cape',
        },
        {
          value: 'FS',
          label: 'Free State',
        },
        {
          value: 'GP',
          label: 'Gauteng',
        },
        {
          value: 'KZN',
          label: 'KwaZulu-Natal',
        },
        {
          value: 'LP',
          label: 'Limpopo',
        },
        {
          value: 'MP',
          label: 'Mpumalanga',
        },
        {
          value: 'NC',
          label: 'Northern Cape',
        },
        {
          value: 'NW',
          label: 'North West',
        },
        {
          value: 'WC',
          label: 'Western Cape',
        },
      ],
    },
    {
      name: 'country',
      label: 'Country',
      type: 'dropdown',
      disabled: true,
      options: [
        {
          value: 'ZAF',
          label: 'South Africa',
        },
      ],
    },
  ];

  const formFields = fields.map((field) => FormField(field)).join('');

  return `
  <form id="bash--address-form" method="post">
    ${formFields}
  </form>
  
  `;
};

export default RICAForm;
