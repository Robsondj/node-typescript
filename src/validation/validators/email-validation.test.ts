import { InvalidParamError } from '../../presentation/errors'
import { type EmailValidator } from '../interfaces/email-validator'
import { EmailValidation } from './email-validation'

import faker from 'faker'

const field = faker.random.word()

const email = faker.internet.email()
const input = { [field]: email }

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutType {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidatorStub()
  const emailValidation = new EmailValidation(field, emailValidatorStub)
  return {
    sut: emailValidation,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  test('Should call EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate(input)
    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('Should return InvalidParamError if validation fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError(field))
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  test('Should return null if validation succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate(input)
    expect(error).toBeNull()
  })
})
