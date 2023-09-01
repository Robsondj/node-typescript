import request from 'supertest'
import { setupApp } from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { type Express } from 'express'
import { hash } from 'bcrypt'
import { type Collection } from 'mongodb'

let app: Express
let accountCollection: Collection

describe('Login Routes', () => {
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

  describe('SignUp Route', () => {
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

  describe('Login Route', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Robson',
        email: 'robson@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'robson@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'robson@gmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
