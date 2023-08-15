import { type Authentication } from '../../../domain/usecases/authentication'
import { type Encrypter } from '../../interfaces/cryptography/encrypter'
import { type LoadAccountByEmailRepository } from '../../interfaces/db/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '../../interfaces/db/update-acesstoken-repository'
import { type HashComparer } from '../../interfaces/cryptography/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (email: string, password: string): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      return null
    }
    const comparison = await this.hashComparer.compare(password, account.password)
    if (!comparison) {
      return null
    }
    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
