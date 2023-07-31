import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http-helpers'
import { type HttpRequest, type Controller } from '../../interfaces'
import { type EmailValidator } from '../signup/signup-interfaces'
import { LoginController } from './login'
import { type Authentication } from '../../../domain/usecases/authentication'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, passoword: string): Promise<string> {
      return await new Promise(resolve => { resolve('token') })
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: Controller
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeRequest = (): HttpRequest => {
  return {
    body: {
      email: 'email@mail.com',
      password: 'password'
    }
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    const badRequestConst = {
      statusCode: 400,
      body: new MissingParamError('email')
    }
    expect(httpResponse).toEqual(badRequestConst)
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    const badRequestConst = {
      statusCode: 400,
      body: new MissingParamError('password')
    }
    expect(httpResponse).toEqual(badRequestConst)
  })

  test('Should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError('Server Error'))
  })

  test('Should call Authentication with correct params', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest: HttpRequest = makeRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith(email, password)
  })

  test('Should return 401 if invalid invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError('Server Error'))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(successRequest('token'))
  })
})
