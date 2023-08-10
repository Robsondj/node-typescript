export interface LogErrorRepository {
  add: (stack: string) => Promise<void>
}
