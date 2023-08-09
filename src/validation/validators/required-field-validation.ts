import { MissingParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/interfaces/validation'

export class RequiredFieldValidation implements Validation {
  private readonly field: string

  constructor (field: string) {
    this.field = field
  }

  validate (input: any): Error | null {
    if (!input[this.field]) {
      return new MissingParamError(this.field)
    }
    return null
  }
}
