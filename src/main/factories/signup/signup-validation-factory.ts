import { type Validation } from '../../../presentation/interfaces/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { CompareFieldValidation } from '../../../validation/validators/compare-field-validation'
import { EmailValidation } from '../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../validation/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
