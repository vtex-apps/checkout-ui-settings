import DropDown from './DropDown';
import Note from './Note';
import Radio from './Radio';
import TextField from './TextField';
import Checkbox from './Checkbox';

const FormField = ({
  label,
  name,
  value = '',
  required = true,
  type = 'text',
  placeholder,
  autoComplete = 'on',
  maxLength,
  minlength,
  disabled = false,
  options,
  checked,
}) => {
  const fieldId = name.replace(/\s/g, '-');

  const formField = () => {
    switch (type) {
      case 'radio':
        return Radio({ name, options });
      case 'dropdown':
        return DropDown({ name, disabled, options });
      case 'note':
        return Note({ name, value });
      case 'checkbox':
        return Checkbox({ name, label, checked });
      default:
        return TextField({ name, value, required, type, placeholder, autoComplete, maxLength, minlength });
    }
  };

  // TODO add drop downs, etc.
  return `
<p class="input bash--${type}field-${name.replace(/\s/g, '-')} bash--${type} ${required ? 'required' : 'optional'}">
  ${label ? `<label id="bash--label-${fieldId}" for="bash--input-${fieldId}">${label}</label>` : ''}
 ${formField()}
</p>  
`;
};

export default FormField;
