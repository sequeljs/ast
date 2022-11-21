import FakeConnectionPool from './FakeConnectionPool'

import type Connection from '../../src/interfaces/Connection'
import type Engine from '../../src/interfaces/Engine'

export default class FakeRecord implements Engine {
  public connectionPool = new FakeConnectionPool()

  get connection(): Connection {
    return this.connectionPool.connection
  }
}
