export interface UpdateAccessTokenRepository {
  update: (id: string, acessToken: string) => Promise<void>
}
