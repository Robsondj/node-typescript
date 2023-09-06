import { type AccountModel } from '../../../domain/models/account'
import { type AddAccountModel, type AddAccount } from '../../../domain/usecases/add-account'
import { type AddAccountRepository } from '../../interfaces/db/add-account-repository'
import { type Encrypter } from '../../interfaces/cryptography/encrypter'
import { type CheckAccountByEmailRepository } from '../../interfaces/db/check-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  constructor (
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository,
    checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
    this.checkAccountByEmailRepository = checkAccountByEmailRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const checkByEmail = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    if (checkByEmail) {
      return null
    }
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
