import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-repository'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, bcryptAdapter, accountMongoRepository)
}
