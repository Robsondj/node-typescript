import { type Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http-helpers'
import { type HttpRequest, type Controller, type HttpResponse } from '../../interfaces'
import { type EmailValidator } from '../signup/signup-interfaces'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized()
      }
      return successRequest(token)
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
