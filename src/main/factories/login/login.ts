import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-repository'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { type Controller } from '../../../presentation/interfaces'
import { LogControllerDecorator } from '../../decorators/log-controller'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, bcryptAdapter, accountMongoRepository)
  const loginValidation = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, loginValidation)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorMongoRepository)
}
