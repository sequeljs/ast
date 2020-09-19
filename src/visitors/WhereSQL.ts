import SQLLiteral from '../nodes/SQLLiteral.js'

import ToSQL from './ToSQL.js'

import type Collector from '../collectors/Collector.js'

import type Connection from '../interfaces/Connection.js'

import type SelectCore from '../nodes/SelectCore.js'

import type Visitable from './Visitable.js'
import type Visitor from './Visitor.js'

/**
 * @internal
 */
interface CollectorConstructor {
  new (): Collector
}

export default class WhereSQL extends ToSQL {
  private innerVisitor: Visitor

  constructor(innerVisitor: Visitor, connection: Connection) {
    super(connection)

    this.innerVisitor = innerVisitor
  }

  protected visitSelectCore(thing: SelectCore, col: Collector): Collector {
    let collector = col

    collector.append(' WHERE ')

    const wheres = thing.wheres.map((where: Visitable) => {
      const CollectorClass: CollectorConstructor = col.constructor as CollectorConstructor
      const innerCollector = new CollectorClass()

      return new SQLLiteral(
        this.innerVisitor.accept(where, innerCollector).value,
      )
    })

    collector = this.injectJoin(wheres, collector, ' AND ')

    return collector
  }
}
