import { type Authentication } from '../../../domain/usecases/authentication'
import { badRequest, serverError, successRequest, unauthorized } from '../../helpers/http-helpers'
import { type HttpRequest, type Controller, type HttpResponse } from '../../interfaces'
import { type Validation } from '../../interfaces/validation'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation
  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError !== null) {
        return badRequest(validationError)
      }
      const { email, password } = httpRequest.body
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
