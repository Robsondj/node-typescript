import { type RequestHandler, type Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup'

export default (route: Router): void => {
  route.post('/signup', adaptRoute(makeSignUpController()) as RequestHandler)
}
