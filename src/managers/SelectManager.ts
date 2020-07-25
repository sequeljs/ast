import SQLString from '../collectors/SQLString'

import EmptyJoinError from '../errors/EmptyJoinError'
import EngineNotSetError from '../errors/EngineNotSetError'
import VisitorNotSetError from '../errors/VisitorNotSetError'

import Distinct from '../nodes/Distinct'
import DistinctOn from '../nodes/DistinctOn'
import Except from '../nodes/Except'
import Exists from '../nodes/Exists'
import Group from '../nodes/Group'
import InnerJoin from '../nodes/InnerJoin'
import Intersect from '../nodes/Intersect'
import Join from '../nodes/Join'
import Limit from '../nodes/Limit'
import Lock from '../nodes/Lock'
import NamedWindow from '../nodes/NamedWindow'
import Offset from '../nodes/Offset'
import On from '../nodes/On'
import OuterJoin from '../nodes/OuterJoin'
import SQLLiteral from '../nodes/SQLLiteral'
import SelectStatement from '../nodes/SelectStatement'
import StringJoin from '../nodes/StringJoin'
import Top from '../nodes/Top'
import Union from '../nodes/Union'
import UnionAll from '../nodes/UnionAll'
import With from '../nodes/With'
import WithRecursive from '../nodes/WithRecursive'

import WhereSQL from '../visitors/WhereSQL'

import SequelAST from '../SequelAST'

import TreeManager from './TreeManager'

import type Engine from '../interfaces/Engine'
import type Relation from '../interfaces/Relation'

import type CRUD from '../mixins/CRUD'

import type SelectCore from '../nodes/SelectCore'
import type TableAlias from '../nodes/TableAlias'

class SelectManager extends TreeManager<SelectStatement> {
  protected ctx: SelectCore

  get constraints(): SelectCore['wheres'] {
    return this.ctx.wheres
  }

  get froms(): SelectStatement['cores'] {
    return this.ast.cores.map((c) => c.from).filter(Boolean)
  }

  get joinSources(): SelectCore['source']['right'] {
    return this.ctx.source.right
  }

  get limit(): SelectStatement['limit']['expr'] {
    return this.ast.limit && this.ast.limit.expr
  }

  set limit(limit: SelectStatement['limit']['expr']) {
    this.take(limit)
  }

  get locked(): SelectStatement['lock'] {
    return this.ast.lock
  }

  get offset(): SelectStatement['offset']['expr'] {
    return this.ast.offset && this.ast.offset.expr
  }

  set offset(amount: SelectStatement['offset']['expr']) {
    this.skip(amount)
  }

  get orders(): SelectStatement['orders'] {
    return this.ast.orders
  }

  get projections(): SelectCore['projections'] {
    return this.ctx.projections
  }

  set projections(projections: SelectCore['projections']) {
    this.ctx.projections = projections
  }

  get source(): SelectCore['source'] {
    return this.ctx.source
  }

  get taken(): SelectManager['limit'] {
    return this.limit
  }

  constructor(table: any = null) {
    super(new SelectStatement())

    this.ctx = this.ast.cores[this.ast.cores.length - 1]

    this.from(table)
  }

  private collapse(exprs: any[]): any {
    let expressions = exprs

    expressions = expressions.filter(Boolean).map((expr) => {
      if (typeof expr === 'string') {
        return new SQLLiteral(expr)
      }

      return expr
    })

    if (expressions.length === 1) {
      return expressions[0]
    }

    return this.createAnd(expressions)
  }

  as(other: any): TableAlias {
    return this.createTableAlias(this.grouping(this.ast), new SQLLiteral(other))
  }

  distinct(value = true): SelectManager {
    this.ctx.setQuantifier = value ? new Distinct() : null

    return this
  }

  distinctOn(value: any): SelectManager {
    this.ctx.setQuantifier = value ? new DistinctOn(value) : null

    return this
  }

  except(other: TreeManager<SelectStatement>): Except {
    return new Except(this.ast, other.ast)
  }

  exists(): Exists {
    return new Exists(this.ast)
  }

  from(table: any): SelectManager {
    if (table instanceof Join) {
      this.ctx.source.right.push(table)
    } else if (typeof table === 'string') {
      this.ctx.source.left = new SQLLiteral(table)
    } else {
      this.ctx.source.left = table
    }

    return this
  }

  group(...columns: any[]) {
    columns.forEach((column) => {
      let col = column

      if (typeof col === 'string') {
        col = new SQLLiteral(col)
      }

      this.ctx.groups.push(new Group(col))
    })

    return this
  }

  having(expr: any): SelectManager {
    this.ctx.havings.push(expr)

    return this
  }

  intersect(other: TreeManager<SelectStatement>): Intersect {
    return new Intersect(this.ast, other.ast)
  }

  join(
    relation: string | Relation | SQLLiteral | null,
    klass: typeof Join = InnerJoin,
  ): SelectManager {
    if (relation === null) {
      return this
    }

    let Klass: typeof Join = klass
    let rel = relation

    if (typeof rel === 'string' || rel instanceof SQLLiteral) {
      rel = new SQLLiteral(rel)
      if (rel.value.length <= 0) {
        throw new EmptyJoinError()
      }

      Klass = StringJoin
    }

    this.ctx.source.right.push(this.createJoin(rel, null, Klass))

    return this
  }

  lock(locking: any = new SQLLiteral('FOR UPDATE')): SelectManager {
    let lock = locking
    if (lock === true) {
      lock = new SQLLiteral('FOR UPDATE')
    } else if (typeof lock === 'string' || lock instanceof SQLLiteral) {
      lock = new SQLLiteral(lock)
    }

    this.ast.lock = new Lock(lock)

    return this
  }

  minus(other: TreeManager<SelectStatement>): Except {
    return this.except(other)
  }

  on(...exprs: any[]): SelectManager {
    this.ctx.source.right[this.ctx.source.right.length - 1].right = new On(
      this.collapse(exprs),
    )

    return this
  }

  order(...expr: any[]): SelectManager {
    this.ast.orders.push(
      ...expr.map((e) => {
        return typeof e === 'string' ? new SQLLiteral(e) : e
      }),
    )

    return this
  }

  outerJoin(relation: Relation | null): SelectManager {
    return this.join(relation, OuterJoin)
  }

  project(...projections: any[]): SelectManager {
    this.ctx.projections.push(
      ...projections.map((p) =>
        typeof p === 'string' ? new SQLLiteral(p) : p,
      ),
    )

    return this
  }

  skip(amount: any): SelectManager {
    this.ast.offset = amount ? new Offset(amount) : null

    return this
  }

  take(limit: any): SelectManager {
    if (limit) {
      this.ast.limit = new Limit(limit)
      this.ctx.top = new Top(limit)
    } else {
      this.ast.limit = null
      this.ctx.top = null
    }

    return this
  }

  union(other: TreeManager<SelectStatement>): Union {
    return new Union(this.ast, other.ast)
  }

  unionAll(other: TreeManager<SelectStatement>): UnionAll {
    return new UnionAll(this.ast, other.ast)
  }

  whereSQL(engine: Engine | null = SequelAST.engine): SQLLiteral | null {
    if (!engine) {
      throw new EngineNotSetError()
    }

    if (this.ctx.wheres.length <= 0) {
      return null
    }

    if (!engine.connection.visitor) {
      throw new VisitorNotSetError()
    }

    const visitor = new WhereSQL(engine.connection.visitor, engine.connection)

    return new SQLLiteral(visitor.accept(this.ctx, new SQLString()).value)
  }

  window(name: any): NamedWindow {
    const window = new NamedWindow(name)

    this.ctx.windows.push(window)

    return window
  }

  with(...subqueries: any[]): SelectManager {
    this.ast.with = new With(
      subqueries.reduce((acc, val) => acc.concat(val), []),
    )

    return this
  }

  withRecursive(...subqueries: any[]): SelectManager {
    this.ast.with = new WithRecursive(
      subqueries.reduce((acc, val) => acc.concat(val), []),
    )

    return this
  }
}

interface SelectManager extends CRUD {}

export default SelectManager
