import { type AccountModel } from '../../../domain/models/account'
import { type AddAccountModel } from '../../../domain/usecases/add-account'
import { type AddAccountRepository } from '../../interfaces/db/add-account-repository'
import { type Encrypter } from '../../interfaces/cryptography/encrypter'
import { DbAddAccount } from './db-add-account'
import { type CheckAccountByEmailRepository } from '../../interfaces/db/check-account-by-email-repository'

interface SutType {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}
const makeSut = (): SutType => {
  const encrypterStub = makeStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const checkAccountByEmailRepositoryStub = makeCheckAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  }
}

const makeStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const account = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'hashed_password'
      }
      return await new Promise(resolve => { resolve(account) })
    }
  }
  return new AddAccountRepositoryStub()
}

const makeCheckAccountByEmailRepositoryStub = (): CheckAccountByEmailRepository => {
  class CheckByEmailRepositoryStub implements CheckAccountByEmailRepository {
    async checkByEmail (email: string): Promise<boolean> {
      return await new Promise(resolve => { resolve(false) })
    }
  }
  return new CheckByEmailRepositoryStub()
}

const makeAccountData = (): AddAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw exception in case encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeAccountData()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' })
  })

  test('Should throw exception in case AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeAccountData()
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'id',
      name: 'name',
      email: 'email',
      password: 'hashed_password'
    })
  })

  test('Should call CheckAccountByEmailRepository with correct value', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const checkByEmailSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    const accountData = makeAccountData()
    await sut.add(accountData)
    expect(checkByEmailSpy).toHaveBeenCalledWith(accountData.email)
  })

  test('Should return null in case CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(new Promise(resolve => { resolve(true) }))
    const accountData = makeAccountData()
    const account = await sut.add(accountData)
    expect(account).toBeNull()
  })
})
