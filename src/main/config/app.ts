import express from 'express'
import setUpMiddlewares from './middlewares'

export const app = express()
setUpMiddlewares(app)
