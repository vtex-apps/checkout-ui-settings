import { ERRORS } from '../utils/const.js'

const InputError = (error) => {
  return `<span class="help error">${error ?? ERRORS.DEFAULT}</span>`
}

export default InputError
