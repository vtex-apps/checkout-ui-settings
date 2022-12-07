import Radio from './Radio';
import TextField from './TextField';

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
  checked = false,
  disabled = false,
  options,
}) => {
  const fieldId = name.replace(/\s/g, '-');

  const formField = () => {
    switch (type) {
      case 'radio':
        return Radio({ name, checked, disabled, options });
      default:
        return TextField({ name, value, required, type, placeholder, autoComplete, maxLength, minlength });
    }
  };

  // TODO add drop downs, etc.
  return `
<p class="input bash--${type}field-${name.replace(/\s/g, '-')} text ${required ? 'required' : 'optional'}">
  ${label && `<label id="bash--label-${fieldId}" for="bash--input-${fieldId}">${label}</label>`}
 ${formField()}
</p>  
`;
};

export default FormField;
