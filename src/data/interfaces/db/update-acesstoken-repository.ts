export interface UpdateAccessTokenRepository {
  updateAccessToken: (id: string, acessToken: string) => Promise<void>
}
