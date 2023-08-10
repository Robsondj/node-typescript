import { type Encrypter } from '../../data/interfaces/cryptography/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt

  constructor (salt) {
    this.salt = salt
  }

  async encrypt (data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt)
  }
}
