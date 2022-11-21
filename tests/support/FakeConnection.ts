import type Connection from '../../src/interfaces/Connection'

import type Visitor from '../../src/visitors/Visitor'

import { quote, quoteColumnName, quoteTableName } from './quote'

export default class FakeConnection implements Connection {
  public readonly tables: string[]

  public visitor: Visitor | null

  get inClauseLength(): number {
    return 3
  }

  constructor(visitor: Visitor | null = null) {
    this.tables = ['users', 'photos', 'developers', 'products']

    this.visitor = visitor
  }

  quote(thing: number | string): number | string {
    return quote(thing)
  }

  quoteColumnName(name: string): string {
    return quoteColumnName(name)
  }

  quoteTableName(name: string): string {
    return quoteTableName(name)
  }

  sanitizeAsSQLComment(comment: string): string {
    return comment
  }
}
