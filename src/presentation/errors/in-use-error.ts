export class InUseError extends Error {
  constructor (paramName: string) {
    super(`${paramName} already in use`)
    this.name = 'InvalidParamError'
  }
}
