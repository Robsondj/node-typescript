import { type HttpRequest, type HttpResponse, type Controller, type AddAccount } from './signup-interfaces'
import { badRequest, serverError, successRequest } from '../../helpers/http-helpers'
import { type Validation } from '../../interfaces/validation'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
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
      return successRequest(account)
    } catch (error) {
      console.log(error)
      return serverError(error.stack)
    }
  }
}
