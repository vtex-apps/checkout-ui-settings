const TextField = ({
  name,
  value = '',
  required = true,
  type = 'text',
  placeholder,
  autoComplete = 'on',
  minLength = 0,
  maxLength = 0,
}) => {
  const fieldId = name.replace(/\s/g, '-');
  return `
  <input 
    ${required ? 'required="required"' : ''}
    autocomplete="${autoComplete}" 
    id="bash--input-${fieldId}" 
    type="${type}" 
    name="${name}" 
    maxlength="${maxLength}"
    ${minLength ? `minlength="${minLength}"` : ''}
    ${maxLength ? `minlength="${maxLength}"` : ''}
    placeholder="${placeholder ?? ''}" 
    class="input-xlarge" 
    value="${value}" 
  />
`;
};

export default TextField;
