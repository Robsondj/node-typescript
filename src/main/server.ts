import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from '../main/config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const { app } = (await import('./config/app'))
    app.listen(env.port, () => { console.log(`Server running on http://localhost:${env.port}`) })
  })
  .catch(console.error)
