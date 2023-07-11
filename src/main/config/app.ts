import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from '../config/routes'

export const app = express()
setUpMiddlewares(app)
setUpRoutes(app)
