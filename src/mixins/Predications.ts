import And from '../nodes/And.js'
import Between from '../nodes/Between.js'
import DoesNotMatch from '../nodes/DoesNotMatch.js'
import Equality from '../nodes/Equality.js'
import GreaterThan from '../nodes/GreaterThan.js'
import GreaterThanOrEqual from '../nodes/GreaterThanOrEqual.js'
import Grouping from '../nodes/Grouping.js'
import In from '../nodes/In.js'
import IsDistinctFrom from '../nodes/IsDistinctFrom.js'
import IsNotDistinctFrom from '../nodes/IsNotDistinctFrom.js'
import LessThan from '../nodes/LessThan.js'
import LessThanOrEqual from '../nodes/LessThanOrEqual.js'
import Matches from '../nodes/Matches.js'
import NotEqual from '../nodes/NotEqual.js'
import NotIn from '../nodes/NotIn.js'
import NotRegexp from '../nodes/NotRegexp.js'
import Or from '../nodes/Or.js'
import Regexp from '../nodes/Regexp.js'
import buildQuoted from '../nodes/buildQuoted.js'

import type BindParam from '../nodes/BindParam.js'
import type Quoted from '../nodes/Quoted.js'

export default abstract class Predications {
  protected groupingAll(
    method: (expr: any, ...extras: any[]) => any,
    others: any[],
    ...extras: any[]
  ): Grouping {
    const nodes = others.map((expr) => method(expr, ...extras))

    return new Grouping(new And(nodes))
  }

  protected groupingAny(
    method: (expr: any, ...extras: any[]) => any,
    others: any[],
    ...extras: any[]
  ): Grouping {
    const nodes = others.map((expr) => method(expr, ...extras))

    return new Grouping(nodes.reduce((memo, node) => new Or(memo, node)))
  }

  protected isInfinity(value: any): boolean {
    return value === Infinity || value === -Infinity || value.isInfinite?.()
  }

  protected isOpenEnded(value: any): boolean {
    return value === null || this.isInfinity(value) || this.isUnboundable(value)
  }

  protected isUnboundable(value: any): boolean {
    return value?.isUnboundable?.()
  }

  doesNotMatch(
    other: any,
    escape: any = null,
    caseSensitive = false,
  ): DoesNotMatch {
    return new DoesNotMatch(this, this.quotedNode(other), escape, caseSensitive)
  }

  doesNotMatchAll(
    others: any,
    escape: any = null,
    caseSensitive = false,
  ): Grouping {
    return this.groupingAll(
      this.doesNotMatch.bind(this),
      others,
      escape,
      caseSensitive,
    )
  }

  doesNotMatchAny(
    others: any,
    escape: any = null,
    caseSensitive = false,
  ): Grouping {
    return this.groupingAny(
      this.doesNotMatch.bind(this),
      others,
      escape,
      caseSensitive,
    )
  }

  doesNotMatchRegexp(other: any, caseSensitive = true): NotRegexp {
    return new NotRegexp(this, this.quotedNode(other), caseSensitive)
  }

  eq(other: any): Equality {
    return new Equality(this, this.quotedNode(other))
  }

  eqAll(others: any[]): Grouping {
    return this.groupingAll(this.eq.bind(this), this.quotedArray(others))
  }

  eqAny(others: any[]): Grouping {
    return this.groupingAny(this.eq.bind(this), others)
  }

  gt(other: any): GreaterThan {
    return new GreaterThan(this, this.quotedNode(other))
  }

  gtAll(others: any[]): Grouping {
    return this.groupingAll(this.gt.bind(this), others)
  }

  gtAny(others: any[]): Grouping {
    return this.groupingAny(this.gt.bind(this), others)
  }

  gteq(other: any): GreaterThanOrEqual {
    return new GreaterThanOrEqual(this, this.quotedNode(other))
  }

  gteqAll(others: any[]): Grouping {
    return this.groupingAll(this.gteq.bind(this), others)
  }

  gteqAny(others: any[]): Grouping {
    return this.groupingAny(this.gteq.bind(this), others)
  }

  inVal(other: any): In {
    if (typeof other === 'object' && !Array.isArray(other) && 'ast' in other) {
      return new In(this, other.ast)
    }

    if (Array.isArray(other) && Symbol.iterator in other) {
      return new In(this, this.quotedArray(other))
    }

    return new In(this, this.quotedNode(other))
  }

  inAll(others: any[]): Grouping {
    return this.groupingAll(this.inVal.bind(this), others)
  }

  inAny(others: any[]): Grouping {
    return this.groupingAny(this.inVal.bind(this), others)
  }

  isNotDistinctFrom(other: any): IsNotDistinctFrom {
    return new IsNotDistinctFrom(this, this.quotedNode(other))
  }

  isDistinctFrom(other: any): IsDistinctFrom {
    return new IsDistinctFrom(this, this.quotedNode(other))
  }

  lt(other: any): LessThan {
    return new LessThan(this, this.quotedNode(other))
  }

  ltAll(others: any[]): Grouping {
    return this.groupingAll(this.lt.bind(this), others)
  }

  ltAny(others: any[]): Grouping {
    return this.groupingAny(this.lt.bind(this), others)
  }

  lteq(other: any): LessThanOrEqual {
    return new LessThanOrEqual(this, this.quotedNode(other))
  }

  lteqAll(others: any[]): Grouping {
    return this.groupingAll(this.lteq.bind(this), others)
  }

  lteqAny(others: any[]): Grouping {
    return this.groupingAny(this.lteq.bind(this), others)
  }

  matches(other: any, escape: any = null, caseSensitive = false): Matches {
    return new Matches(this, this.quotedNode(other), escape, caseSensitive)
  }

  matchesAll(
    others: any[],
    escape: any = null,
    caseSensitive = false,
  ): Grouping {
    return this.groupingAll(
      this.matches.bind(this),
      others,
      escape,
      caseSensitive,
    )
  }

  matchesAny(
    others: any[],
    escape: any = null,
    caseSensitive = false,
  ): Grouping {
    return this.groupingAny(
      this.matches.bind(this),
      others,
      escape,
      caseSensitive,
    )
  }

  matchesRegexp(other: any, caseSensitive = true): Regexp {
    return new Regexp(this, this.quotedNode(other), caseSensitive)
  }

  notEq(other: any): NotEqual {
    return new NotEqual(this, this.quotedNode(other))
  }

  notEqAll(others: any[]): Grouping {
    return this.groupingAll(this.notEq.bind(this), others)
  }

  notEqAny(others: any[]): Grouping {
    return this.groupingAny(this.notEq.bind(this), others)
  }

  notInVal(other: any): NotIn {
    if (typeof other === 'object' && !Array.isArray(other) && 'ast' in other) {
      return new NotIn(this, other.ast)
    }

    if (Array.isArray(other) && Symbol.iterator in other) {
      return new NotIn(this, this.quotedArray(other))
    }

    return new NotIn(this, this.quotedNode(other))
  }

  notInAll(others: any[]): Grouping {
    return this.groupingAll(this.notInVal.bind(this), others)
  }

  notInAny(others: any[]): Grouping {
    return this.groupingAny(this.notInVal.bind(this), others)
  }

  quotedNode(other: any): any {
    return buildQuoted(other, this)
  }

  quotedArray(others: any[]): any[] {
    return others.map((v) => this.quotedNode(v))
  }

  between(
    begin: number | BindParam | Quoted,
    end: number | BindParam | Quoted,
    inclusive = true,
  ): And | Between | GreaterThanOrEqual | LessThan | LessThanOrEqual | NotIn {
    if (this.isUnboundable(begin) || this.isUnboundable(end)) {
      return this.inVal([])
    }

    if (this.isOpenEnded(begin)) {
      if (this.isOpenEnded(end)) {
        return this.notInVal([])
      }

      if (!inclusive) {
        return this.lt(end)
      }

      return this.lteq(end)
    }

    if (this.isOpenEnded(end)) {
      return this.gteq(begin)
    }

    if (!inclusive) {
      return this.gteq(begin).and(this.lt(end))
    }

    const left = this.quotedNode(begin)
    const right = this.quotedNode(end)

    return new Between(this, left.and(right))
  }

  notBetween(
    begin: number | BindParam | Quoted,
    end: number | BindParam | Quoted,
    inclusive = true,
  ): GreaterThan | GreaterThanOrEqual | Grouping | In | LessThan {
    if (this.isUnboundable(begin) || this.isUnboundable(end)) {
      return this.notInVal([])
    }

    if (this.isOpenEnded(begin)) {
      if (this.isOpenEnded(end)) {
        return this.inVal([])
      }

      if (!inclusive) {
        return this.gteq(end)
      }

      return this.gt(end)
    }

    if (this.isOpenEnded(end)) {
      return this.lt(begin)
    }

    const left = this.lt(begin)
    const right = !inclusive ? this.gteq(end) : this.gt(end)

    return left.or(right)
  }
}
