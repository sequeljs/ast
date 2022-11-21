import ToSQL from '../../src/visitors/ToSQL'

import FakeConnection from './FakeConnection'

export default class FakeConnectionPool {
  public readonly connection: FakeConnection

  constructor() {
    this.connection = new FakeConnection()
    this.connection.visitor = new ToSQL(this.connection)
  }
}
