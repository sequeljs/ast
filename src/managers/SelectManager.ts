import SQLString from '../collectors/SQLString.js'

import EmptyJoinError from '../errors/EmptyJoinError.js'
import EngineNotSetError from '../errors/EngineNotSetError.js'
import VisitorNotSetError from '../errors/VisitorNotSetError.js'

import Comment from '../nodes/Comment.js'
import Distinct from '../nodes/Distinct.js'
import DistinctOn from '../nodes/DistinctOn.js'
import Except from '../nodes/Except.js'
import Exists from '../nodes/Exists.js'
import Group from '../nodes/Group.js'
import InnerJoin from '../nodes/InnerJoin.js'
import Intersect from '../nodes/Intersect.js'
import Join from '../nodes/Join.js'
import Lateral from '../nodes/Lateral.js'
import Limit from '../nodes/Limit.js'
import Lock from '../nodes/Lock.js'
import NamedWindow from '../nodes/NamedWindow.js'
import Offset from '../nodes/Offset.js'
import On from '../nodes/On.js'
import OptimizerHints from '../nodes/OptimizerHints.js'
import OuterJoin from '../nodes/OuterJoin.js'
import SQLLiteral from '../nodes/SQLLiteral.js'
import SelectStatement from '../nodes/SelectStatement.js'
import StringJoin from '../nodes/StringJoin.js'
import Union from '../nodes/Union.js'
import UnionAll from '../nodes/UnionAll.js'
import With from '../nodes/With.js'
import WithRecursive from '../nodes/WithRecursive.js'

import WhereSQL from '../visitors/WhereSQL.js'

import SequelAST from '../SequelAST.js'

import TreeManager from './TreeManager.js'

import type Engine from '../interfaces/Engine.js'
import type Relation from '../interfaces/Relation.js'

import type CRUD from '../mixins/CRUD.js'

import type SelectCore from '../nodes/SelectCore.js'
import type TableAlias from '../nodes/TableAlias.js'

class SelectManager extends TreeManager<SelectManager, SelectStatement> {
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

  comment(...values: any): SelectManager {
    this.ctx.comment = new Comment(values)

    return this
  }

  distinct(value = true): SelectManager {
    this.ctx.setQuantifier = value ? new Distinct() : null

    return this
  }

  distinctOn(value: any): SelectManager {
    this.ctx.setQuantifier = value ? new DistinctOn(value) : null

    return this
  }

  except(other: TreeManager<SelectManager, SelectStatement>): Except {
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

  intersect(other: TreeManager<SelectManager, SelectStatement>): Intersect {
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
      if (rel.length <= 0) {
        throw new EmptyJoinError()
      }

      Klass = StringJoin
    }

    this.ctx.source.right.push(this.createJoin(rel, null, Klass))

    return this
  }

  lateral(tableName: string | null = null): Lateral {
    const base = tableName ? this.as(tableName) : this.ast

    return new Lateral(base)
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

  minus(other: TreeManager<SelectManager, SelectStatement>): Except {
    return this.except(other)
  }

  on(...exprs: any[]): SelectManager {
    this.ctx.source.right[this.ctx.source.right.length - 1].right = new On(
      this.collapse(exprs),
    )

    return this
  }

  optimizerHints(...hints: any[]): SelectManager {
    if (hints.length > 0) {
      this.ctx.optimizerHints = new OptimizerHints(hints)
    }

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
    } else {
      this.ast.limit = null
    }

    return this
  }

  union(other: TreeManager<SelectManager, SelectStatement>): Union {
    return new Union(this.ast, other.ast)
  }

  unionAll(other: TreeManager<SelectManager, SelectStatement>): UnionAll {
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
