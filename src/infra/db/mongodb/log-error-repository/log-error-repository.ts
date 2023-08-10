import { type LogErrorRepository } from '../../../../data/interfaces/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async add (stack: string): Promise<void> {
    const logErrorCollection = MongoHelper.getCollection('logError')
    await logErrorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
