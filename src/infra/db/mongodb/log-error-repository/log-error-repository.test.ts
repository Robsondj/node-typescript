import { type Collection } from 'mongodb'
import { type LogErrorRepository } from '../../../../data/interfaces/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log-error-repository'

let logErrorCollection: Collection

describe('LogError Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? 'localhost')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    logErrorCollection = MongoHelper.getCollection('logError')
    await logErrorCollection.deleteMany({})
  })

  const makeSut = (): LogErrorRepository => {
    return new LogErrorMongoRepository()
  }

  test('Should insert an log on success', async () => {
    const sut = makeSut()
    await sut.add('Stack Error')
    const count = await logErrorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
