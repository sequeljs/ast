import FakeConnectionPool from './FakeConnectionPool.js'

import type Connection from '../../src/interfaces/Connection.js'
import type Engine from '../../src/interfaces/Engine.js'

export default class FakeRecord implements Engine {
  public connectionPool = new FakeConnectionPool()

  get connection(): Connection {
    return this.connectionPool.connection
  }
}
