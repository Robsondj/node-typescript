import { type RequestHandler, type Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup'
import { makeLoginController } from '../factories/login/login'

export default (route: Router): void => {
  route.post('/signup', adaptRoute(makeSignUpController()) as RequestHandler)
  route.post('/login', adaptRoute(makeLoginController()) as RequestHandler)
}
