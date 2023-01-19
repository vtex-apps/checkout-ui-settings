import { getBestPhoneNumber } from '../../utils/phoneFields';
import FormField from './Elements/FormField';
import { getBestRecipient } from './utils';

const AddressForm = () => {
  const fields = [
    {
      name: 'addressId',
      type: 'hidden',
      value: '',
      required: false,
    },
    {
      name: 'addressName',
      type: 'hidden',
      value: '',
      required: false,
      maxLength: 50,
    },
    {
      name: 'street',
      label: 'Street address',
      required: true,
      value: '',
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
      required: false,
      value: '  ',
      type: 'hidden',
    },
    {
      name: 'companyBuilding',
      label: 'Building/Complex and number',
      required: false,
      value: '',
      maxLength: 100,
    },
    {
      name: 'neighborhood',
      label: 'Suburb',
      value: '',
      maxLength: 750,
    },
    {
      name: 'city',
      label: 'City',
      required: true,
      value: '',
      maxLength: 750,
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
      type: 'note',
      required: false,
      name: 'country-display',
      label: 'Country',
      value: 'South Africa',
    },
    {
      type: 'hidden',
      required: true,
      name: 'country',
      value: 'ZAF',
    },
    {
      name: 'receiverName',
      label: 'Recipient’s name',
      required: true,
      value: getBestRecipient(),
    },
    {
      name: 'complement',
      label: 'Recipient’s mobile number',
      required: true,
      value: getBestPhoneNumber(),
      type: 'tel',
      helperText: 'We send shipping updates to this number.',
    },
  ];

  const formFields = fields.map((field) => FormField(field)).join('');

  return `
  <form id="bash--address-form" method="post">
    ${formFields}

    <button 
      class="submit btn-go-to-payment btn btn-large btn-success"
      id="btn-save-address" 
      type="submit"
    >
      Save address
    </button>
  </form>
  
  `;
};

export default AddressForm;
