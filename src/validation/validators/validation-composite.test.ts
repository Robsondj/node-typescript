import faker from 'faker'
import { InvalidParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/interfaces/validation'
import { ValidationComposite } from './validation-composite'

const field = faker.random.word()
const value = faker.random.word()

const input = { [field]: value }

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    constructor (private readonly field: string) {}

    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub(field)
}

interface SutType {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const validationStubs = [validationStub, validationStub]
  const validationComposite = new ValidationComposite(validationStubs)
  return {
    sut: validationComposite,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('Should return Error if validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate(input)
    expect(error).toBeInstanceOf(Error)
  })

  test('Should call validations with correct params', () => {
    const { sut, validationStubs } = makeSut()
    const validate = jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    sut.validate(input)
    expect(validate).toBeCalledWith(input)
  })

  test('Should return the first error', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError(''))
    const error = sut.validate(input)
    expect(error).toEqual(new Error())
  })

  test('Should return null if validation succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate(input)
    expect(error).toBeNull()
  })
})
