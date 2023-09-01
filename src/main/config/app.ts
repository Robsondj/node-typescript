import express, { type Express } from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from '../config/routes'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setUpMiddlewares(app)
  setUpRoutes(app)
  return app
}
