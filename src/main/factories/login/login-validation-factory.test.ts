import { type Validation } from '../../../presentation/interfaces/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidation } from '../../../validation/validators/email-validation'
import { RequiredFieldValidation } from '../../../validation/validators/required-field-validation'
import { ValidationComposite } from '../../../validation/validators/validation-composite'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call Validation Composite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      const validate = new RequiredFieldValidation(field)
      validations.push(validate)
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
