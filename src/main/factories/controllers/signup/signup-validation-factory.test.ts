import { makeSignUpValidation } from './signup-validation-factory'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { CompareFieldValidation } from '../../../../validation/validators/compare-field-validation'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { type Validation } from '../../../../presentation/interfaces/validation'

jest.mock('../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
