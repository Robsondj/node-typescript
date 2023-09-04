import { type HttpRequest, type HttpResponse, type Controller, type AddAccount } from './signup-interfaces'
import { badRequest, forbidden, serverError, successRequest } from '../../helpers/http-helpers'
import { type Validation } from '../../interfaces/validation'
import { type Authentication } from '../../../domain/usecases/authentication'
import { InUseError } from '../../errors'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (addAccount: AddAccount, validation: Validation, authentication: Authentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError !== null) {
        return badRequest(validationError)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (account === null) {
        return forbidden(new InUseError('Email'))
      }
      const token = await this.authentication.auth(email, password)
      return successRequest(token)
    } catch (error) {
      console.log(error)
      return serverError(error.stack)
    }
  }
}
