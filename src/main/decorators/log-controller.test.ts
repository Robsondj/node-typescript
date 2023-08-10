import { type LogErrorRepository } from '../../data/interfaces/db/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helpers'
import { type Controller, type HttpRequest, type HttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-controller'

const makeStubController = (): Controller => {
  class StubController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => {
        resolve({
          statusCode: 200,
          body: 'body'
        })
      })
    }
  }

  return new StubController()
}

const makeStubLogErrorRepository = (): LogErrorRepository => {
  class StubLogErrorRepository implements LogErrorRepository {
    async add (stack: string): Promise<void> {

    }
  }
  return new StubLogErrorRepository()
}

interface MakeSutType {
  sut: LogControllerDecorator
  stubController: Controller
  stubLogErrorRepository: LogErrorRepository
}

const makeSut = (): MakeSutType => {
  const stubController = makeStubController()
  const stubLogErrorRepository = makeStubLogErrorRepository()
  const sut = new LogControllerDecorator(stubController, stubLogErrorRepository)
  return {
    sut,
    stubController,
    stubLogErrorRepository
  }
}

describe('LogController Decorator', () => {
  test('Should receive a controller and return an HttpResponse', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: 'body'
    })
  })

  test('Should call Controller Handle with correct params', async () => {
    const { sut, stubController } = makeSut()
    const handleSpy = jest.spyOn(stubController, 'handle')

    await sut.handle({
      body: 'body'
    })

    expect(handleSpy).toHaveBeenCalledWith({
      body: 'body'
    })
  })

  test('Should call LogErrorRepository Add with correct params', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut()
    jest.spyOn(stubController, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(serverError('Stack Server Error')) }))
    const addLogErrorRepositorySpy = jest.spyOn(stubLogErrorRepository, 'add')

    await sut.handle({
      body: 'body'
    })

    expect(addLogErrorRepositorySpy).toHaveBeenCalledWith('Stack Server Error')
  })
})
