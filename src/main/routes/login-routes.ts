import { type RequestHandler, type Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'

export default (route: Router): void => {
  route.post('/signup', adaptRoute(makeSignUpController()) as RequestHandler)
  route.post('/login', adaptRoute(makeLoginController()) as RequestHandler)
}
