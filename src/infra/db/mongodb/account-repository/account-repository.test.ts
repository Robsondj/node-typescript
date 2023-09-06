import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'
import faker from 'faker'

const accoutData = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? 'localhost')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('Add', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut()
      const account = await sut.add(accoutData)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('LoadByEmail', () => {
    test('Should return an account on success', async () => {
      await accountCollection.insertOne(accoutData)
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if nothing is found', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('UpdateAccessToken', () => {
    test('Should update the access token on success', async () => {
      const res = await accountCollection.insertOne(accoutData)
      const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
      expect(fakeAccount?.accessToken).toBeFalsy()
      const sut = makeSut()
      const accessToken = faker.datatype.uuid()
      await sut.updateAccessToken(fakeAccount?._id.toString() ?? '', accessToken)
      const account = await accountCollection.findOne({ _id: fakeAccount?._id })
      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe(accessToken)
    })
  })

  describe('checkByEmail', () => {
    test('Should return true in case existing an account with this email', async () => {
      await accountCollection.insertOne(accoutData)
      const sut = makeSut()
      const account = await sut.checkByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
    })

    test('Should return false in case not existing', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })
})
