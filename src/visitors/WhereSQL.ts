import SQLLiteral from '../nodes/SQLLiteral'

import ToSQL from './ToSQL'
import { AND, WHERE } from './constants'

import type Collector from '../collectors/Collector'

import type Connection from '../interfaces/Connection'

import type SelectCore from '../nodes/SelectCore'

import type Visitable from './Visitable'
import type Visitor from './Visitor'

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

    collector.append(WHERE)

    const wheres = thing.wheres.map((where: Visitable) => {
      const CollectorClass: CollectorConstructor = col.constructor as CollectorConstructor
      const innerCollector = new CollectorClass()

      return new SQLLiteral(
        this.innerVisitor.accept(where, innerCollector).value,
      )
    })

    collector = this.injectJoin(wheres, collector, AND)

    return collector
  }
}
