import { InvalidParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/interfaces/validation'

export class CompareFieldValidation implements Validation {
  private readonly field: string
  private readonly fieldToCompare: string

  constructor (field: string, fieldToCompare: string) {
    this.field = field
    this.fieldToCompare = fieldToCompare
  }

  validate (input: any): Error | null {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
    return null
  }
}
