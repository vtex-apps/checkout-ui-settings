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
    ${required ? ' required ' : ''}
    autocomplete="${autoComplete}" 
    id="bash--input-${fieldId}" 
    type="${type}" 
    name="${name}" 
    ${minLength > 0 ? `minlength="${minLength}"` : ''}
    ${maxLength > 0 ? `maxlength="${maxLength}"` : ''}
    placeholder="${placeholder ?? ''}" 
    class="input-xlarge" 
    value="${value}" 
  />
`;
};

export default TextField;
