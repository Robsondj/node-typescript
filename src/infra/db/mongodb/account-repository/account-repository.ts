import { type AddAccountRepository } from '../../../../data/interfaces/db/add-account-repository'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { type AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { type LoadAccountByEmailRepository } from '../../../../data/interfaces/db/load-account-by-email-repository'
import { ObjectId, type Collection } from 'mongodb'
import { type UpdateAccessTokenRepository } from '../../../../data/interfaces/db/update-acesstoken-repository'
import { type CheckAccountByEmailRepository } from '../../../../data/interfaces/db/check-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, CheckAccountByEmailRepository {
  private readonly accountCollection: Collection

  constructor () {
    this.accountCollection = MongoHelper.getCollection('accounts')
  }

  async add (data: AddAccountModel): Promise<AccountModel> {
    const result = await this.accountCollection.insertOne({ ...data })
    const objectId = result.insertedId
    return Object.assign({}, data, { id: objectId.toString() })
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const result = await this.accountCollection.findOne({ email }, {
      projection: {
        _id: 1,
        name: 1,
        email,
        password: 1
      }
    })
    return result && MongoHelper.map(result)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const idObject = new ObjectId(id)
    await this.accountCollection.updateOne({
      _id: idObject
    }, {
      $set: {
        accessToken
      }
    })
  }

  async checkByEmail (email: string): Promise<boolean> {
    const result = await this.accountCollection.findOne({ email }, {
      projection: {
        _id: 1
      }
    })
    return result !== null
  }
}
