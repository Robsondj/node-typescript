import { type Encrypter } from '../../data/interfaces/cryptography/encrypter'
import jsonwebtoken from 'jsonwebtoken'

export class JWTAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jsonwebtoken.sign({ id: value }, this.secret)
  }
}
