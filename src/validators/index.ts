/**
 * @fileoverview
 * @module
 * @version
 */

export { validateAdmin } from './admin.validator';

export { validateContactUpdate } from './contact.validator';

export {
  isPassword,
  updatePasswordSchema,
  validatePasswordUpdate,
} from './password.validator';

export {
  adminRegisterSchema,
  candidateRegisterSchema,
  recruiterRegisterSchema,
  registerValidator,
} from './register.validator';

export { compareStrings } from './string.validator';
