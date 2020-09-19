import SelectStatement from '../nodes/SelectStatement.js'

import ToSQL from './ToSQL.js'

import type Collector from '../collectors/Collector.js'

import type BindParam from '../nodes/BindParam.js'
import type Cube from '../nodes/Cube.js'
import type DistinctOn from '../nodes/DistinctOn.js'
import type DoesNotMatch from '../nodes/DoesNotMatch.js'
import type GroupingElement from '../nodes/GroupingElement.js'
import type GroupingSet from '../nodes/GroupingSet.js'
import type IsDistinctFrom from '../nodes/IsDistinctFrom.js'
import type IsNotDistinctFrom from '../nodes/IsNotDistinctFrom.js'
import type Lateral from '../nodes/Lateral.js'
import type Matches from '../nodes/Matches.js'
import type NotRegexp from '../nodes/NotRegexp.js'
import type NullsFirst from '../nodes/NullsFirst.js'
import type NullsLast from '../nodes/NullsLast.js'
import type Regexp from '../nodes/Regexp.js'
import type RollUp from '../nodes/RollUp.js'

export default class PostgreSQL extends ToSQL {
  private groupingArrayOrGroupingElement(
    thing: Cube | GroupingSet | RollUp,
    col: Collector,
  ): Collector {
    let collector = col

    if (Array.isArray(thing.expr)) {
      collector.append('( ')
      collector = this.visit(thing.expr, collector)
      collector.append(' )')
    } else {
      collector = this.visit(thing.expr, collector)
    }

    return collector
  }

  private groupingParentheses(thing: Lateral, col: Collector): Collector {
    let collector = col

    if (thing.expr instanceof SelectStatement) {
      collector.append('(')
      collector = this.visit(thing.expr, collector)
      collector.append(')')
    } else {
      collector = this.visit(thing.expr, collector)
    }

    return collector
  }

  protected visitBindParam(thing: BindParam, col: Collector): Collector {
    let collector = col

    collector = collector.addBind(thing.value, (i) => `$${i}`)

    return collector
  }

  protected visitCube(thing: Cube, col: Collector): Collector {
    let collector = col

    collector.append('CUBE')

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }

  protected visitDistinctOn(thing: DistinctOn, col: Collector): Collector {
    let collector = col

    collector.append('DISTINCT ON ( ')
    collector = this.visit(thing.expr, collector)
    collector.append(' )')

    return collector
  }

  protected visitDoesNotMatch(thing: DoesNotMatch, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? ' NOT LIKE ' : ' NOT ILIKE '

    collector = this.infixValue(thing, collector, op)

    if (thing.escape) {
      collector.append(' ESCAPE ')

      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitGroupingElement(
    thing: GroupingElement,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('( ')
    collector = this.visit(thing.expr, collector)
    collector.append(' )')

    return collector
  }

  protected visitGroupingSet(thing: GroupingSet, col: Collector): Collector {
    let collector = col

    collector.append('GROUPING SETS')

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }

  protected visitIsDistinctFrom(
    thing: IsDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' IS DISTINCT FROM ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitIsNotDistinctFrom(
    thing: IsNotDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' IS NOT DISTINCT FROM ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitLateral(thing: Lateral, col: Collector): Collector {
    let collector = col

    collector.append('LATERAL ')

    collector = this.groupingParentheses(thing, collector)

    return collector
  }

  protected visitMatches(thing: Matches, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? ' LIKE ' : ' ILIKE '

    collector = this.infixValue(thing, collector, op)

    if (thing.escape) {
      collector.append(' ESCAPE ')

      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitNotRegexp(thing: NotRegexp, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? ' !~ ' : ' !~* '

    collector = this.infixValue(thing, collector, op)

    return collector
  }

  protected visitNullsFirst(thing: NullsFirst, col: Collector): Collector {
    return this.visit(thing.expr, col).append(' NULLS FIRST')
  }

  protected visitNullsLast(thing: NullsLast, col: Collector): Collector {
    return this.visit(thing.expr, col).append(' NULLS LAST')
  }

  protected visitRegexp(thing: Regexp, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? ' ~ ' : ' ~* '

    collector = this.infixValue(thing, collector, op)

    return collector
  }

  protected visitRollUp(thing: RollUp, col: Collector): Collector {
    let collector = col

    collector.append('ROLLUP')

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }
}
