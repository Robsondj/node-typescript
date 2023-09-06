import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-repository'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { type Controller } from '../../../presentation/interfaces'
import { LogControllerDecorator } from '../../decorators/log-controller'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, bcryptAdapter, accountMongoRepository)
  const signupController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signupController, logErrorMongoRepository)
}
