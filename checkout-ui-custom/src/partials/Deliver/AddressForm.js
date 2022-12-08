import { getBestPhoneNumber } from '../../utils/phoneFields';
import FormField from './Elements/FormField';

const AddressForm = () => {
  const fields = [
    {
      name: 'addressId',
      type: 'hidden',
      value: '',
      required: false,
    },

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
      value: getBestPhoneNumber(),
      type: 'tel',
    },
    {
      name: 'addressType',
      label: 'Address type',
      required: true,
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
      value: '',
    },
    {
      name: 'street',
      label: 'Street address',
      required: true,
      value: '',
    },
    {
      name: 'neighborhood',
      label: 'Suburb',
      value: '',
    },
    {
      name: 'postalCode',
      label: 'Postal code',
      value: '',
      type: 'tel',
      minlength: 4,
      maxLength: 4,
    },
    {
      type: 'note',
      required: false,
      name: 'suburb-postal-reminder',
      value: 'Make sure to specify the correct Suburb and Postal code so we can easily find your address.',
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
      label: 'Province',
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

export default AddressForm;
