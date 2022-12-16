import FormField from './Elements/FormField';
import { initGoogleAutocomplete } from './utils';

const AddressSearch = () => {
  setTimeout(() => {
    initGoogleAutocomplete();
  }, 500);

  return FormField({
    name: 'address-search',
    placeholder: 'Start typing an address...',
    autoComplete: 'off',
  });
};

export default AddressSearch;
