import ToSQL from './ToSQL'
import {
  CUBE,
  DISTINCT_ON,
  ESCAPE,
  GROUPING_SET,
  ILIKE,
  LIKE,
  NOT_ILIKE,
  NOT_LIKE,
  ROLLUP,
  SPACE,
} from './constants'

import type Collector from '../collectors/Collector'

import type BindParam from '../nodes/BindParam'
import type Cube from '../nodes/Cube'
import type DistinctOn from '../nodes/DistinctOn'
import type DoesNotMatch from '../nodes/DoesNotMatch'
import type GroupingElement from '../nodes/GroupingElement'
import type GroupingSet from '../nodes/GroupingSet'
import type Matches from '../nodes/Matches'
import type NotRegexp from '../nodes/NotRegexp'
import type Regexp from '../nodes/Regexp'
import type RollUp from '../nodes/RollUp'

export default class PostgreSQL extends ToSQL {
  private groupingArrayOrGroupingElement(
    thing: Cube | GroupingSet | RollUp,
    col: Collector,
  ): Collector {
    let collector = col

    if (Array.isArray(thing.expr)) {
      collector.append('(')
      collector.append(SPACE)
      collector = this.visit(thing.expr, collector)
      collector.append(SPACE)
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

    collector.append(CUBE)

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }

  protected visitDistinctOn(thing: DistinctOn, col: Collector): Collector {
    let collector = col

    collector.append(DISTINCT_ON)
    collector.append(SPACE)
    collector.append('(')
    collector.append(SPACE)
    collector = this.visit(thing.expr, collector)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitDoesNotMatch(thing: DoesNotMatch, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? NOT_LIKE : NOT_ILIKE

    collector = this.infixValue(thing, collector, op)

    if (thing.escape) {
      collector.append(ESCAPE)

      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitGroupingElement(
    thing: GroupingElement,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('(')
    collector.append(SPACE)
    collector = this.visit(thing.expr, collector)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitGroupingSet(thing: GroupingSet, col: Collector): Collector {
    let collector = col

    collector.append(GROUPING_SET)

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }

  protected visitMatches(thing: Matches, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? LIKE : ILIKE

    collector = this.infixValue(thing, collector, op)

    if (thing.escape) {
      collector.append(ESCAPE)

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

  protected visitRegexp(thing: Regexp, col: Collector): Collector {
    let collector = col

    const op = thing.caseSensitive ? ' ~ ' : ' ~* '

    collector = this.infixValue(thing, collector, op)

    return collector
  }

  protected visitRollUp(thing: RollUp, col: Collector): Collector {
    let collector = col

    collector.append(ROLLUP)

    collector = this.groupingArrayOrGroupingElement(thing, collector)

    return collector
  }
}
