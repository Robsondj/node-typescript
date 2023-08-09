import faker from 'faker'
import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldValidation } from './compare-field-validation'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

const value = faker.random.word()
const wrongValue = faker.random.word()

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation(field, fieldToCompare)
}

describe('CompareFieldValidation', () => {
  test('Should return InvalidParamError if comparison fails', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: value, [fieldToCompare]: wrongValue })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  test('Should return null if validation succeed', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: value, [fieldToCompare]: value })
    expect(error).toBeNull()
  })
})
