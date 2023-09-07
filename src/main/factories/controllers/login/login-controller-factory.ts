import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { type Controller } from '../../../../presentation/interfaces'
import { LogControllerDecorator } from '../../../decorators/log-controller'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const loginValidation = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, loginValidation)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorMongoRepository)
}
