import { type AddAccountRepository } from '../../../../data/interfaces/add-account-repository'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { type AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    const objectId = result.insertedId
    return Object.assign({}, data, { id: objectId.toString() })
  }
}
