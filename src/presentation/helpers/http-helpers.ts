import { ServerError } from '../errors'
import { type HttpResponse } from '../interfaces/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (stackError: string): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(stackError)
})

export const successRequest = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
