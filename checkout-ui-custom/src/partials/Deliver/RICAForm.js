import FormField from './Elements/FormField';
import { getBestRecipient } from './utils';

const RICAForm = () => {
  const {
    shippingData: { selectedAddress },
  } = window.vtexjs.checkout.orderForm;

  // use rica_ prefix to ensure fields are unique

  const fields = [
    {
      name: 'rica_idOrPassport',
      label: 'ID or Passport number',
      required: true,
      value: '',
    },
    {
      name: 'rica_sameAddress',
      label: 'Residential address the same as delivery address',
      type: 'checkbox',
      checked: true,
      required: false,
    },
    // for rest of the fields check if
    // same as residential address is checked?
    // if checked prefill the fields otherwise don't
  ];

  const conditionalFields = [
    {
      name: 'rica_fullName',
      label: 'Full name and surname',
      required: true,
      value: getBestRecipient({ type: 'delivery' }) || '',
    },
    {
      name: 'rica_streetAddress',
      label: 'Street address',
      required: true,
      value: selectedAddress?.street || '',
    },
    {
      name: 'rica_suburb',
      label: 'Suburb',
      value: selectedAddress?.neighborhood || '',
    },
    {
      name: 'rica_city',
      label: 'City',
      required: true,
      value: selectedAddress?.city || '',
    },
    {
      name: 'rica_postalCode',
      label: 'Postal code',
      value: selectedAddress?.postalCode || '',
      type: 'tel',
      minlength: 4,
      maxLength: 4,
    },
    {
      name: 'rica_province',
      label: 'Province',
      type: 'dropdown',
      options: [
        {
          value: '',
          label: 'Select',
          disabled: true,
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
      type: 'note',
      required: false,
      name: 'rica-country-display',
      label: 'Country',
      value: 'South Africa',
    },
    {
      type: 'hidden',
      required: true,
      name: 'country',
      value: 'ZAF',
    },
  ];

  const formFields = fields.map((field) => FormField(field)).join('');
  const conditionalFormFields = conditionalFields.map((field) => FormField(field)).join('');

  return `
    ${formFields}
    <div class="rica-conditional-fields hide">
    ${conditionalFormFields}
    </div>
  `;
};

export default RICAForm;
