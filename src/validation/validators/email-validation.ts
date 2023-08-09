import { InvalidParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/interfaces/validation'
import { type EmailValidator } from '../interfaces/email-validator'

export class EmailValidation implements Validation {
  private readonly field: string
  private readonly emailValidator: EmailValidator

  constructor (field: string, emailValidator: EmailValidator) {
    this.field = field
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input[this.field])) {
      return new InvalidParamError(this.field)
    }
    return null
  }
}
