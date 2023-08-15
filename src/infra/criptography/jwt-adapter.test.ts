import { type Encrypter } from '../../data/interfaces/cryptography/encrypter'
import jsonwebtoken from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'token'
  }
}))

const makeSut = (): Encrypter => {
  return new JWTAdapter('secret')
}

const id = 'any_id'

describe('JWTAdapter', () => {
  test('Shouw call jsonwebtoken with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jsonwebtoken, 'sign')
    await sut.encrypt(id)
    expect(signSpy).toHaveBeenCalledWith({ id }, 'secret')
  })

  test('Should return the token on success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt(id)
    expect(token).toBe('token')
  })

  test('Should throw when jsonwebtoken throws', async () => {
    const sut = makeSut()
    jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt(id)
    await expect(promise).rejects.toThrow()
  })
})
