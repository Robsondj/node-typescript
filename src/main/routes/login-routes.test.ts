import request from 'supertest'
import { setupApp } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { type Express } from 'express'

let app: Express

describe('SignUp Route', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL ?? 'mongodb://localhost:27017/scale-node-api')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Robson',
        email: 'robson@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(200)
  })
})
