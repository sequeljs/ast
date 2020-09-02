import Limit from '../nodes/Limit.js'
import SQLLiteral from '../nodes/SQLLiteral.js'
import Union from '../nodes/Union.js'

import ToSQL from './ToSQL.js'

import type Collector from '../collectors/Collector.js'

import type Bin from '../nodes/Bin.js'
import type Concat from '../nodes/Concat.js'
import type IsDistinctFrom from '../nodes/IsDistinctFrom.js'
import type IsNotDistinctFrom from '../nodes/IsNotDistinctFrom.js'
import type SelectCore from '../nodes/SelectCore.js'
import type SelectStatement from '../nodes/SelectStatement.js'
import type UnqualifiedColumn from '../nodes/UnqualifiedColumn.js'
import type UpdateStatement from '../nodes/UpdateStatement.js'

export default class MySQL extends ToSQL {
  protected visitBin(thing: Bin, col: Collector): Collector {
    let collector = col

    collector.append('BINARY ')

    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitConcat(thing: Concat, col: Collector): Collector {
    let collector = col

    collector.append(' CONCAT(')
    collector = this.visit(thing.left, collector)
    collector.append(', ')
    collector = this.visit(thing.right, collector)
    collector.append(') ')

    return collector
  }

  protected visitIsDistinctFrom(
    thing: IsDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('NOT ')

    collector = this.visitIsNotDistinctFrom(thing, collector)

    return collector
  }

  protected visitIsNotDistinctFrom(
    thing: IsNotDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' <=> ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitSelectCore(thing: SelectCore, col: Collector): Collector {
    if (!thing.from) {
      // eslint-disable-next-line no-param-reassign
      thing.from = new SQLLiteral('DUAL')
    }

    return super.visitSelectCore(thing, col)
  }

  protected visitSelectStatement(
    thing: SelectStatement,
    col: Collector,
  ): Collector {
    if (thing.offset && !thing.limit) {
      /**
       * https://dev.mysql.com/doc/refman/8.0/en/select.html
       * To retrieve all rows from a certain offset up to the end of the result
       * set, you can use some large number for the second parameter.
       */
      // eslint-disable-next-line no-param-reassign
      thing.limit = new Limit(new SQLLiteral('18446744073709551615'))
    }

    return super.visitSelectStatement(thing, col)
  }

  protected visitUnion(
    thing: Union,
    col: Collector,
    suppressParens = false,
  ): Collector {
    let collector = col

    if (!suppressParens) {
      collector.append('( ')
    }

    if (thing.left instanceof Union) {
      collector = this.visitUnion(thing.left, collector, true)
    } else {
      collector = this.visit(thing.left, collector)
    }

    collector.append(' UNION ')

    if (thing.right instanceof Union) {
      collector = this.visitUnion(thing.right, collector, true)
    } else {
      collector = this.visit(thing.right, collector)
    }

    if (!suppressParens) {
      collector.append(' )')
    }

    return collector
  }

  protected visitUnqualifiedColumn(
    thing: UnqualifiedColumn,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitUpdateStatement(
    thing: UpdateStatement,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('UPDATE ')

    collector = this.visit(thing.relation, collector)

    if (thing.values.length > 0) {
      collector.append(' SET ')
      collector = this.injectJoin(thing.values, collector, ', ')
    }

    if (thing.wheres.length > 0) {
      collector.append(' WHERE ')
      collector = this.injectJoin(thing.wheres, collector, ' AND ')
    }

    if (thing.orders.length > 0) {
      collector.append(' ORDER BY ')
      collector = this.injectJoin(thing.orders, collector, ', ')
    }

    collector = this.maybeVisit(thing.limit, collector)

    return collector
  }
}
