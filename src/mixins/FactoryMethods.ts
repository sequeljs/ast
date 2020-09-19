import And from '../nodes/And.js'
import False from '../nodes/False.js'
import Grouping from '../nodes/Grouping.js'
import InnerJoin from '../nodes/InnerJoin.js'
import NamedSQLFunction from '../nodes/NamedSQLFunction.js'
import On from '../nodes/On.js'
import StringJoin from '../nodes/StringJoin.js'
import TableAlias from '../nodes/TableAlias.js'
import True from '../nodes/True.js'
import buildQuoted from '../nodes/buildQuoted.js'

import Relation from '../interfaces/Relation.js'

import FullOuterJoin from '../nodes/FullOuterJoin.js'
import OuterJoin from '../nodes/OuterJoin.js'
import RightOuterJoin from '../nodes/RightOuterJoin.js'
import SQLLiteral from '../nodes/SQLLiteral.js'

import Join from '../nodes/Join.js'

export default abstract class FactoryMethods {
  coalesce(...exprs: any[]): NamedSQLFunction {
    return new NamedSQLFunction('COALESCE', exprs)
  }

  createAnd(clauses: any[]): And {
    return new And(clauses)
  }

  createFalse(): False {
    return new False()
  }

  createJoin(to: string | Relation | SQLLiteral | null): InnerJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
  ): InnerJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
    Klass: typeof FullOuterJoin,
  ): FullOuterJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
    Klass: typeof InnerJoin,
  ): InnerJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
    Klass: typeof OuterJoin,
  ): OuterJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
    Klass: typeof RightOuterJoin,
  ): RightOuterJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any,
    Klass: typeof StringJoin,
  ): StringJoin
  createJoin(
    to: string | Relation | SQLLiteral | null,
    constraint: any = null,
    Klass: typeof Join = InnerJoin,
  ): Join {
    return new Klass(to, constraint)
  }

  createOn(expr: any): On {
    return new On(expr)
  }

  createStringJoin(to: string | Relation | SQLLiteral | null): StringJoin {
    return this.createJoin(to, null, StringJoin)
  }

  createTableAlias(
    relation: Grouping | Relation,
    name: string | SQLLiteral,
  ): TableAlias {
    return new TableAlias(relation, name)
  }

  createTrue(): True {
    return new True()
  }

  grouping(expr: any): Grouping {
    return new Grouping(expr)
  }

  lower(column: any): NamedSQLFunction {
    return new NamedSQLFunction('LOWER', [buildQuoted(column)])
  }
}
