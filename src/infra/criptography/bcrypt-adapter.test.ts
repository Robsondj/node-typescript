import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  },

  async compare (data, encrypted): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt hash with correct values', async () => {
    const sut = makeSut()
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(bcryptHashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw exception in case bcrypt encrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut()
    const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hash_value')
    expect(bcryptCompareSpy).toHaveBeenCalledWith('any_value', 'hash_value')
  })

  test('Should return true on compare success', async () => {
    const sut = makeSut()
    const compare = await sut.compare('any_value', 'hash_value')
    expect(compare).toBe(true)
  })

  test('Should throw in case compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.compare('any_value', 'hash_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should return false on compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const compare = await sut.compare('any_value', 'hash_value')
    expect(compare).toBe(false)
  })
})
