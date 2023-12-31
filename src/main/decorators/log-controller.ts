import { type LogErrorRepository } from '../../data/interfaces/db/log-error-repository'
import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/interfaces'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.add(httpResponse.body.stack)
    }
    return httpResponse
  }
}
