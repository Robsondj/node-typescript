import { type Encrypter } from '../../data/interfaces/cryptography/encrypter'
import bcrypt from 'bcrypt'
import { type HashComparer } from '../../data/interfaces/cryptography/hash-comparer'

export class BcryptAdapter implements Encrypter, HashComparer {
  private readonly salt

  constructor (salt) {
    this.salt = salt
  }

  async encrypt (data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt)
  }

  async compare (plaitext: string, digest: string): Promise<boolean> {
    const compare = await bcrypt.compare(plaitext, digest)
    return compare
  }
}
