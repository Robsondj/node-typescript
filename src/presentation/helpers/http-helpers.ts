import { ServerError } from '../errors'
import { type HttpResponse } from '../interfaces/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const successRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})