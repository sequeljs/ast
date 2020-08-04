import Attribute from '../attributes/Attribute'

import SQLString from '../collectors/SQLString'

import VisitorNotImplementedError from '../errors/VisitorNotImplementedError'
import VisitorNotSupportedError from '../errors/VisitorNotSupportedError'

import Binary from '../nodes/Binary'
import BindParam from '../nodes/BindParam'
import DeleteStatement from '../nodes/DeleteStatement'
import Grouping from '../nodes/Grouping'
import In from '../nodes/In'
import JoinSource from '../nodes/JoinSource'
import Node from '../nodes/Node'
import SQLLiteral from '../nodes/SQLLiteral'
import SelectStatement from '../nodes/SelectStatement'
import TableAlias from '../nodes/TableAlias'
import UpdateStatement from '../nodes/UpdateStatement'

import Visitor from './Visitor'

import type Collector from '../collectors/Collector'

import type Addition from '../nodes/Addition'
import type And from '../nodes/And'
import type As from '../nodes/As'
import type Ascending from '../nodes/Ascending'
import type Assignment from '../nodes/Assignment'
import type Avg from '../nodes/Avg'
import type Between from '../nodes/Between'
import type Bin from '../nodes/Bin'
import type Case from '../nodes/Case'
import type Casted from '../nodes/Casted'
import type Comment from '../nodes/Comment'
import type Count from '../nodes/Count'
import type CurrentRow from '../nodes/CurrentRow'
import type Descending from '../nodes/Descending'
import type Distinct from '../nodes/Distinct'
import type DistinctOn from '../nodes/DistinctOn'
import type Division from '../nodes/Division'
import type DoesNotMatch from '../nodes/DoesNotMatch'
import type Else from '../nodes/Else'
import type Equality from '../nodes/Equality'
import type Except from '../nodes/Except'
import type Exists from '../nodes/Exists'
import type Extract from '../nodes/Extract'
import type False from '../nodes/False'
import type Following from '../nodes/Following'
import type FullOuterJoin from '../nodes/FullOuterJoin'
import type GreaterThan from '../nodes/GreaterThan'
import type GreaterThanOrEqual from '../nodes/GreaterThanOrEqual'
import type Group from '../nodes/Group'
import type InfixOperation from '../nodes/InfixOperation'
import type InnerJoin from '../nodes/InnerJoin'
import type InsertStatement from '../nodes/InsertStatement'
import type Intersect from '../nodes/Intersect'
import type IsDistinctFrom from '../nodes/IsDistinctFrom'
import type IsNotDistinctFrom from '../nodes/IsNotDistinctFrom'
import type LessThan from '../nodes/LessThan'
import type LessThanOrEqual from '../nodes/LessThanOrEqual'
import type Limit from '../nodes/Limit'
import type Lock from '../nodes/Lock'
import type Matches from '../nodes/Matches'
import type Max from '../nodes/Max'
import type Min from '../nodes/Min'
import type Multiplication from '../nodes/Multiplication'
import type NamedSQLFunction from '../nodes/NamedSQLFunction'
import type NamedWindow from '../nodes/NamedWindow'
import type Not from '../nodes/Not'
import type NotEqual from '../nodes/NotEqual'
import type NotIn from '../nodes/NotIn'
import type NotRegexp from '../nodes/NotRegexp'
import type Offset from '../nodes/Offset'
import type On from '../nodes/On'
import type OptimizerHints from '../nodes/OptimizerHints'
import type Or from '../nodes/Or'
import type OuterJoin from '../nodes/OuterJoin'
import type Over from '../nodes/Over'
import type Preceding from '../nodes/Preceding'
import type Quoted from '../nodes/Quoted'
import type Range from '../nodes/Range'
import type Regexp from '../nodes/Regexp'
import type RightOuterJoin from '../nodes/RightOuterJoin'
import type Rows from '../nodes/Rows'
import type SQLFunction from '../nodes/SQLFunction'
import type SelectCore from '../nodes/SelectCore'
import type StringJoin from '../nodes/StringJoin'
import type Subtraction from '../nodes/Subtraction'
import type Sum from '../nodes/Sum'
import type True from '../nodes/True'
import type UnaryOperation from '../nodes/UnaryOperation'
import type Union from '../nodes/Union'
import type UnionAll from '../nodes/UnionAll'
import type UnqualifiedColumn from '../nodes/UnqualifiedColumn'
import type ValuesList from '../nodes/ValuesList'
import type When from '../nodes/When'
import type Window from '../nodes/Window'
import type With from '../nodes/With'
import type WithRecursive from '../nodes/WithRecursive'

import type AttributeBoolean from '../attributes/Boolean'
import type AttributeDecimal from '../attributes/Decimal'
import type AttributeFloat from '../attributes/Float'
import type AttributeInteger from '../attributes/Integer'
import type AttributeString from '../attributes/String'
import type AttributeTime from '../attributes/Time'

import type Connection from '../interfaces/Connection'

import type SelectManager from '../managers/SelectManager'

import type Table from '../Table'

import type Visitable from './Visitable'

/**
 * @internal
 */
function buildSubselect(
  key: string,
  thing: DeleteStatement | UpdateStatement,
): SelectStatement {
  const stmt = new SelectStatement()

  const [core] = stmt.cores
  core.from = thing.relation
  core.wheres = thing.wheres
  core.projections = [key]

  stmt.limit = thing.limit
  stmt.offset = thing.offset
  stmt.orders = thing.orders

  return stmt
}

/**
 * @internal
 */
function chunkedArray(arr: any[], chunksSize: number): any[][] {
  const chunkedArr = []

  let index = 0
  while (index < arr.length) {
    chunkedArr.push(arr.slice(index, chunksSize + index))

    index += chunksSize
  }

  return chunkedArr
}

export default class ToSQL extends Visitor {
  connection: Connection

  constructor(connection: Connection) {
    super()

    this.connection = connection
  }

  compile(
    node: Visitable,
    collector: Collector<string | string[]> = new SQLString(),
  ): string | string[] {
    return this.accept(node, collector).value
  }

  protected aggregate(
    name: string,
    thing: SQLFunction,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(`${name}(`)
    if (thing.distinct) {
      collector.append(`${'DISTINCT'} `)
    }
    collector = this.injectJoin(thing.expressions, collector, ', ')
    collector.append(')')

    if (thing.alias) {
      collector.append(' AS ')
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected collectInClause(
    left: Visitable,
    right: Visitable | Visitable[],
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(left, collector)
    collector.append(' IN (')
    collector = this.visit(right, collector)
    collector.append(')')

    return collector
  }

  protected collectNodesFor(
    nodes: Visitable[],
    col: Collector,
    spacer: string,
    connector = ', ',
  ): Collector {
    let collector = col

    if (nodes.length > 0) {
      collector.append(spacer)
      collector = this.injectJoin(nodes, collector, connector)
    }

    return collector
  }

  protected collectNotInClause(
    left: Visitable,
    right: Visitable | Visitable[],
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(left, collector)
    collector.append(' NOT IN (')
    collector = this.visit(right, collector)
    collector.append(')')

    return collector
  }

  protected collectOptimizerHints(
    thing: SelectCore,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.maybeVisit(thing.optimizerHints, collector)

    return collector
  }

  protected hasJoinSources(thing: any): boolean {
    return (
      thing.relation instanceof JoinSource && thing.relation.right.length > 0
    )
  }

  protected hasLimitOrOffsetOrOrders(
    thing: DeleteStatement | UpdateStatement,
  ): boolean {
    return thing.limit || thing.offset || thing.orders.length > 0
  }

  protected infixValue(
    thing: Binary,
    col: Collector,
    value: string,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(value)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected infixValueWithParen(
    thing: Binary,
    col: Collector,
    value: string,
    suppressParens = false,
  ): Collector {
    let collector = col

    if (!suppressParens) {
      collector.append('( ')
    }

    if (thing.left.constructor === thing.constructor) {
      collector = this.infixValueWithParen(thing.left, collector, value, true)
    } else {
      collector = this.visit(thing.left, collector)
    }

    collector.append(value)

    if (thing.right.constructor === thing.constructor) {
      collector = this.infixValueWithParen(thing.right, collector, value, true)
    } else {
      collector = this.visit(thing.right, collector)
    }

    if (!suppressParens) {
      collector.append(' )')
    }

    return collector
  }

  protected injectJoin(
    things: Visitable[],
    col: Collector,
    joinStr: string,
  ): Collector {
    let collector = col

    things.forEach((thing, i) => {
      if (i !== 0) {
        collector.append(joinStr)
      }
      collector = this.visit(thing, collector)
    })

    return collector
  }

  protected isDistinctFrom(
    thing: IsDistinctFrom | IsNotDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('CASE WHEN ')
    collector = this.visit(thing.left, collector)
    collector.append(' = ')
    collector = this.visit(thing.right, collector)
    collector.append(' OR (')
    collector = this.visit(thing.left, collector)
    collector.append(' IS NULL AND ')
    collector = this.visit(thing.right, collector)
    collector.append(' IS NULL)')
    collector.append(' THEN 0 ELSE 1 END')

    return collector
  }

  protected isUnboundable(value: any): boolean {
    return value?.isUnboundable?.()
  }

  protected literal(thing: bigint | number | SQLLiteral, col: Collector): Collector {
    return col.append(String(thing))
  }

  protected maybeVisit(thing: Visitable, col: Collector): Collector {
    let collector = col

    if (!thing) {
      return collector
    }

    collector.append(' ')
    collector = this.visit(thing, collector)

    return collector
  }

  protected prepareDeleteUpdateStatement(
    thing: DeleteStatement,
  ): DeleteStatement
  protected prepareDeleteUpdateStatement(
    thing: UpdateStatement,
  ): UpdateStatement
  protected prepareDeleteUpdateStatement(
    thing: DeleteStatement | UpdateStatement,
  ): DeleteStatement | UpdateStatement {
    if (
      thing.key &&
      (this.hasLimitOrOffsetOrOrders(thing) || this.hasJoinSources(thing))
    ) {
      let stmt

      if (thing instanceof DeleteStatement) {
        stmt = new DeleteStatement(thing.left, thing.right)
        stmt.left = thing.left
        stmt.right = thing.right
      } else {
        stmt = new UpdateStatement()
        stmt.relation = thing.relation
        stmt.values = thing.values
      }

      stmt.key = thing.key

      stmt.limit = null
      stmt.offset = null
      stmt.orders = []
      stmt.wheres = [new In(thing.key, [buildSubselect(thing.key, thing)])]
      if (this.hasJoinSources(thing)) {
        stmt.relation = (thing.relation as JoinSource).left
      }

      return stmt
    }

    return thing
  }

  protected prepareDeleteStatement(thing: DeleteStatement): DeleteStatement {
    return this.prepareDeleteUpdateStatement(thing)
  }

  protected prepareUpdateStatement(thing: UpdateStatement): UpdateStatement {
    return this.prepareDeleteUpdateStatement(thing)
  }

  protected quote(value: Visitable): number | string {
    if (value instanceof SQLLiteral) {
      return String(value)
    }

    return this.connection.quote(value)
  }

  protected quoteColumnName(name: number | string | SQLLiteral): string {
    if (name instanceof SQLLiteral) {
      return String(name)
    }

    return this.connection.quoteColumnName(name)
  }

  protected quoteTableName(name: number | string | SQLLiteral): string {
    if (name instanceof SQLLiteral) {
      return String(name)
    }

    return this.connection.quoteTableName(name)
  }

  protected quoted(
    val: Visitable,
    attribute: Attribute | string | null,
  ): number | string {
    if (
      attribute &&
      attribute instanceof Attribute &&
      (attribute as Attribute).isAbleToTypeCast()
    ) {
      return this.quote(attribute.typeCastForDatabase(val))
    }

    return this.quote(val)
  }

  protected sanitizeAsSQLComment(value: any): string | SQLLiteral {
    if (value instanceof SQLLiteral) {
      return value
    }

    return this.connection.sanitizeAsSQLComment(value)
  }

  protected unsupported(thing: unknown, _: Collector): Collector {
    throw new VisitorNotSupportedError(typeof thing)
  }

  protected visitAddition(thing: Addition, col: Collector): Collector {
    return this.visitInfixOperation(thing, col)
  }

  protected visitAnd(thing: And, col: Collector): Collector {
    return this.injectJoin(thing.children, col, ' AND ')
  }

  protected visitArray(things: Array<Visitable>, col: Collector): Collector {
    return this.injectJoin(things, col, ', ')
  }

  protected visitAs(thing: As, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' AS ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitAscending(thing: Ascending, col: Collector): Collector {
    return this.visit(thing.expr, col).append(' ASC')
  }

  protected visitAssignment(thing: Assignment, col: Collector): Collector {
    let collector = col

    if (thing.right instanceof Attribute || thing.right instanceof Node) {
      collector = this.visit(thing.left, collector)
      collector.append(' = ')
      collector = this.visit(thing.right, collector)

      return collector
    }

    collector = this.visit(thing.left, collector)
    collector.append(' = ')
    collector.append(String(this.quote(thing.right)))

    return collector
  }

  protected visitAttributesAttribute(
    thing: Attribute,
    col: Collector,
  ): Collector {
    const collector = col

    let joinName: string | SQLLiteral
    if (thing.relation.tableAlias) {
      if (thing.relation.tableAlias instanceof TableAlias) {
        joinName = thing.relation.tableAlias.name
      } else {
        joinName = thing.relation.tableAlias as string
      }
    } else {
      joinName = thing.relation.name
    }

    collector.append(this.quoteTableName(joinName))
    collector.append('.')
    collector.append(this.quoteColumnName(thing.name))

    return collector
  }

  protected visitAttributesBoolean(
    thing: AttributeBoolean,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAttributesDecimal(
    thing: AttributeDecimal,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAttributesFloat(
    thing: AttributeFloat,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAttributesInteger(
    thing: AttributeInteger,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAttributesString(
    thing: AttributeString,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAttributesTime(
    thing: AttributeTime,
    col: Collector,
  ): Collector {
    return this.visitAttributesAttribute(thing, col)
  }

  protected visitAvg(thing: Avg, col: Collector): Collector {
    return this.aggregate('AVG', thing, col)
  }

  protected visitBetween(thing: Between, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' BETWEEN ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitBigInt(thing: bigint, col: Collector): Collector {
    return this.literal(thing, col)
  }

  protected visitBin(thing: Bin, col: Collector): Collector {
    return this.visit(thing.expr, col)
  }

  protected visitBindParam(thing: BindParam, col: Collector): Collector {
    return col.addBind(thing.value, (_: number) => '?')
  }

  protected visitBoolean(thing: boolean, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitCase(thing: Case, col: Collector): Collector {
    let collector = col

    collector.append('CASE ')

    if (thing.case) {
      collector = this.visit(thing.case, collector)
      collector.append(' ')
    }

    thing.conditions.forEach((condition) => {
      collector = this.visit(condition, collector)
      collector.append(' ')
    })

    if (thing.default) {
      collector = this.visit(thing.default, collector)
      collector.append(' ')
    }

    collector.append('END')

    return collector
  }

  protected visitCasted(thing: Casted, col: Collector): Collector {
    return col.append(String(this.quoted(thing.value, thing.attribute)))
  }

  protected visitComment(thing: Comment, col: Collector): Collector {
    const collector = col

    const comment = thing.values
      .map((value) => `/* ${this.sanitizeAsSQLComment(value)} */`)
      .join(' ')
    collector.append(comment)

    return collector
  }

  protected visitCount(thing: Count, col: Collector): Collector {
    return this.aggregate('COUNT', thing, col)
  }

  protected visitCurrentRow(_: CurrentRow, col: Collector): Collector {
    return col.append('CURRENT ROW')
  }

  protected visitDate(thing: Date, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitDeleteStatement(
    thing: DeleteStatement,
    col: Collector,
  ): Collector {
    let collector = col

    const obj = this.prepareDeleteStatement(thing)

    collector.append('DELETE FROM ')

    collector = this.visit(obj.relation, collector)

    collector = this.collectNodesFor(obj.wheres, collector, ' WHERE ', ' AND ')
    collector = this.collectNodesFor(obj.orders, collector, ' ORDER BY ')

    collector = this.maybeVisit(obj.limit, collector)

    return collector
  }

  protected visitDescending(thing: Descending, col: Collector): Collector {
    return this.visit(thing.expr, col).append(' DESC')
  }

  protected visitDistinct(thing: Distinct, col: Collector): Collector {
    return col.append('DISTINCT')
  }

  protected visitDistinctOn(_1: DistinctOn, _2: Collector): Collector {
    throw new VisitorNotImplementedError(
      'DISTINCT ON not implemented for this db',
    )
  }

  protected visitDivision(thing: Division, col: Collector): Collector {
    return this.visitInfixOperation(thing, col)
  }

  protected visitDoesNotMatch(thing: DoesNotMatch, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' NOT LIKE ')
    collector = this.visit(thing.right, collector)

    if (thing.escape) {
      collector.append(' ESCAPE ')
      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitElse(thing: Else, col: Collector): Collector {
    let collector = col

    collector.append('ELSE ')
    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitEquality(thing: Equality, col: Collector): Collector {
    let collector = col

    if (this.isUnboundable(thing.right)) {
      collector.append('1 = 0')

      return collector
    }

    collector = this.visit(thing.left, collector)

    if (
      thing.right === null ||
      ('value' in thing.right && thing.right.value === null)
    ) {
      collector.append(' IS NULL')

      return collector
    }

    collector.append(' = ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitExcept(thing: Except, col: Collector): Collector {
    let collector = col

    collector.append('( ')
    collector = this.infixValue(thing, col, ' EXCEPT ')
    collector.append(' )')

    return collector
  }

  protected visitExists(thing: Exists, col: Collector): Collector {
    let collector = col

    collector.append(`${'EXISTS '}(`)
    collector = this.visit(thing.expressions, collector)
    collector.append(')')

    if (thing.alias) {
      collector.append(' AS ')
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected visitExtract(thing: Extract, col: Collector): Collector {
    let collector = col

    collector.append(
      `${'EXTRACT'}(${String(thing.field).toUpperCase()}${' FROM '}`,
    )
    collector = this.visit(thing.expr, collector)
    collector.append(')')

    return collector
  }

  protected visitFalse(_: False, col: Collector): Collector {
    return col.append('FALSE')
  }

  protected visitFollowing(thing: Following, col: Collector): Collector {
    let collector = col

    collector = thing.expr
      ? this.visit(thing.expr, collector)
      : collector.append('UNBOUNDED')

    collector.append(' FOLLOWING')

    return collector
  }

  protected visitFullOuterJoin(
    thing: FullOuterJoin,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('FULL OUTER JOIN ')
    collector = this.visit(thing.left, collector)
    collector.append(' ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitGreaterThan(thing: GreaterThan, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' > ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitGreaterThanOrEqual(
    thing: GreaterThanOrEqual,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' >= ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitGroup(thing: Group, col: Collector): Collector {
    return this.visit(thing.expr, col)
  }

  protected visitGrouping(thing: Grouping, col: Collector): Collector {
    let collector = col

    if (thing.expr instanceof Grouping) {
      return this.visit(thing.expr, collector)
    }

    collector.append('(')
    collector = this.visit(thing.expr, collector)
    collector.append(')')

    return collector
  }

  protected visitIn(thing: In, col: Collector): Collector {
    const obj = thing

    let collector = col

    if (!Array.isArray(obj.right)) {
      collector = this.collectInClause(obj.left, obj.right, collector)

      return collector
    }

    if (obj.right.length > 0) {
      obj.right = obj.right.filter((value) => !this.isUnboundable(value))
    }

    if (obj.right.length <= 0) {
      collector.append('1 = 0')

      return collector
    }

    const { inClauseLength } = this.connection

    if (!inClauseLength || obj.right.length <= inClauseLength) {
      collector = this.collectInClause(obj.left, obj.right, collector)
    } else {
      collector.append('(')
      chunkedArray(obj.right, inClauseLength).forEach(
        (value: Visitable[], i) => {
          if (i !== 0) {
            collector.append(' OR ')
          }
          collector = this.collectInClause(obj.left, value, collector)
        },
      )
      collector.append(')')
    }

    return collector
  }

  protected visitInfixOperation(
    thing: InfixOperation,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(` ${thing.operator} `)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitInnerJoin(thing: InnerJoin, col: Collector): Collector {
    let collector = col

    collector.append('INNER JOIN ')
    collector = this.visit(thing.left, collector)

    if (thing.right) {
      collector.append(' ')
      collector = this.visit(thing.right, collector)
    }

    return collector
  }

  protected visitInsertStatement(
    thing: InsertStatement,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('INSERT INTO ')

    collector = this.visit(thing.relation, collector)

    if (thing.columns.length > 0) {
      collector.append(' (')
      thing.columns.forEach((column, index) => {
        if (index !== 0) {
          collector.append(', ')
        }
        collector.append(this.quoteColumnName(column.name))
      })
      collector.append(')')
    }

    if (thing.values) {
      collector = this.maybeVisit(thing.values, collector)

      return collector
    }

    if (thing.select) {
      collector = this.maybeVisit(thing.select, collector)

      return collector
    }

    return collector
  }

  protected visitIntersect(thing: Intersect, col: Collector): Collector {
    let collector = col

    collector.append('( ')
    collector = this.infixValue(thing, col, ' INTERSECT ')
    collector.append(' )')

    return collector
  }

  protected visitIsDistinctFrom(
    thing: IsDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    if (
      thing.right === null ||
      (thing.right &&
        typeof thing.right === 'object' &&
        'value' in thing.right &&
        thing.right.value === null)
    ) {
      collector = this.visit(thing.left, collector)
      collector.append(' IS NOT NULL')
    } else {
      collector = this.isDistinctFrom(thing, collector)
      collector.append(' = 1')
    }

    return collector
  }

  protected visitIsNotDistinctFrom(
    thing: IsNotDistinctFrom,
    col: Collector,
  ): Collector {
    let collector = col

    if (
      thing.right === null ||
      (thing.right &&
        typeof thing.right === 'object' &&
        'value' in thing.right &&
        thing.right.value === null)
    ) {
      collector = this.visit(thing.left, collector)
      collector.append(' IS NULL')
    } else {
      collector = this.isDistinctFrom(thing, collector)
      collector.append(' = 0')
    }

    return collector
  }

  protected visitJoinSource(thing: JoinSource, col: Collector): Collector {
    let collector = col

    if (thing.left) {
      collector = this.visit(thing.left, collector)
    }

    if (thing.right.length > 0) {
      if (thing.left) {
        collector.append(' ')
      }

      collector = this.injectJoin(thing.right, collector, ' ')
    }

    return collector
  }

  protected visitLessThan(thing: LessThan, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' < ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitLessThanOrEqual(
    thing: LessThanOrEqual,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' <= ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitLimit(thing: Limit, col: Collector): Collector {
    let collector = col

    collector.append('LIMIT ')
    collector = this.visit(thing.expr, col)

    return collector
  }

  protected visitLock(thing: Lock, col: Collector): Collector {
    return this.visit(thing.expr, col)
  }

  protected visitMatches(thing: Matches, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' LIKE ')
    collector = this.visit(thing.right, collector)

    if (thing.escape) {
      collector.append(' ESCAPE ')
      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitMax(thing: Max, col: Collector): Collector {
    return this.aggregate('MAX', thing, col)
  }

  protected visitMin(thing: Min, col: Collector): Collector {
    return this.aggregate('MIN', thing, col)
  }

  protected visitMultiplication(
    thing: Multiplication,
    col: Collector,
  ): Collector {
    return this.visitInfixOperation(thing, col)
  }

  protected visitNamedSQLFunction(
    thing: NamedSQLFunction,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(thing.name)
    collector.append('(')
    if (thing.distinct) {
      collector.append(`${'DISTINCT'} `)
    }
    collector = this.injectJoin(thing.expressions, collector, ', ')
    collector.append(')')
    if (thing.alias) {
      collector.append(' AS ')
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected visitNamedWindow(thing: NamedWindow, col: Collector): Collector {
    let collector = col

    collector.append(this.quoteColumnName(thing.name))
    collector.append(' AS ')
    collector = this.visitWindow(thing, collector)

    return collector
  }

  protected visitNot(thing: Not, col: Collector): Collector {
    let collector = col

    collector.append(`${'NOT '}(`)
    collector = this.visit(thing.expr, collector)
    collector.append(')')

    return collector
  }

  protected visitNotEqual(thing: NotEqual, col: Collector): Collector {
    let collector = col

    if (this.isUnboundable(thing.right)) {
      collector.append('1 = 1')

      return collector
    }

    collector = this.visit(thing.left, collector)

    if (
      thing.right === null ||
      ('value' in thing.right && thing.right.value === null)
    ) {
      collector.append(' IS NOT NULL')

      return collector
    }

    collector.append(' != ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitNotIn(thing: NotIn, col: Collector): Collector {
    const obj = thing

    let collector = col

    if (!Array.isArray(obj.right)) {
      collector = this.collectNotInClause(obj.left, obj.right, collector)

      return collector
    }

    if (obj.right.length > 0) {
      obj.right = obj.right.filter((value) => !this.isUnboundable(value))
    }

    if (obj.right.length <= 0) {
      collector.append('1 = 1')

      return collector
    }

    const { inClauseLength } = this.connection

    if (!inClauseLength || obj.right.length <= inClauseLength) {
      collector = this.collectNotInClause(obj.left, obj.right, collector)
    } else {
      collector.append('(')
      chunkedArray(obj.right, inClauseLength).forEach(
        (value: Visitable[], i) => {
          if (i !== 0) {
            collector.append(' AND ')
          }
          collector = this.collectNotInClause(obj.left, value, collector)
        },
      )
      collector.append(')')
    }

    return collector
  }

  protected visitNotRegexp(_1: NotRegexp, _2: Collector): Collector {
    throw new VisitorNotImplementedError('!~ not implemented for this db')
  }

  protected visitNumber(thing: number, col: Collector): Collector {
    return this.literal(thing, col)
  }

  protected visitNull(thing: null, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitOffset(thing: Offset, col: Collector): Collector {
    let collector = col

    collector.append('OFFSET ')
    collector = this.visit(thing.expr, col)

    return collector
  }

  protected visitOn(thing: On, col: Collector): Collector {
    let collector = col

    collector.append('ON ')
    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitOptimizerHints(
    thing: OptimizerHints,
    col: Collector,
  ): Collector {
    const collector = col

    const hints = thing.expr
      .map((value) => this.sanitizeAsSQLComment(value))
      .join(' ')
    collector.append(`/*+ ${hints} */`)

    return collector
  }

  protected visitOr(thing: Or, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(' OR ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitOuterJoin(thing: OuterJoin, col: Collector): Collector {
    let collector = col

    collector.append('LEFT OUTER JOIN ')
    collector = this.visit(thing.left, collector)
    collector.append(' ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitOver(thing: Over, col: Collector): Collector {
    if (!thing.right) {
      return this.visit(thing.left, col).append(`${' OVER '}()`)
    }

    if (thing.right instanceof SQLLiteral) {
      return this.infixValue(thing, col, ' OVER ')
    }

    if (typeof thing.right === 'string') {
      return this.visit(thing.left, col).append(
        `${' OVER '}${this.quoteColumnName(thing.right)}`,
      )
    }

    return this.infixValue(thing, col, ' OVER ')
  }

  protected visitPreceding(thing: Preceding, col: Collector): Collector {
    let collector = col

    collector = thing.expr
      ? this.visit(thing.expr, collector)
      : collector.append('UNBOUNDED')

    collector.append(' PRECEDING')

    return collector
  }

  protected visitQuoted(thing: Quoted, col: Collector): Collector {
    return col.append(String(this.quoted(thing.expr, null)))
  }

  protected visitRange(thing: Range, col: Collector): Collector {
    let collector = col

    if (thing.expr) {
      collector.append(`${'RANGE'} `)
      collector = this.visit(thing.expr, collector)

      return collector
    }

    collector.append('RANGE')

    return collector
  }

  protected visitRegexp(_1: Regexp, _2: Collector): Collector {
    throw new VisitorNotImplementedError('~ not implemented for this db')
  }

  protected visitRightOuterJoin(
    thing: RightOuterJoin,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('RIGHT OUTER JOIN ')
    collector = this.visit(thing.left, collector)
    collector.append(' ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitRows(thing: Rows, col: Collector): Collector {
    let collector = col

    if (thing.expr) {
      collector.append(`${'ROWS'} `)
      collector = this.visit(thing.expr, collector)

      return collector
    }

    collector.append('ROWS')

    return collector
  }

  protected visitSelectCore(thing: SelectCore, col: Collector): Collector {
    let collector = col

    collector.append('SELECT')

    collector = this.collectOptimizerHints(thing, collector)

    collector = this.maybeVisit(thing.setQuantifier, collector)

    collector = this.collectNodesFor(thing.projections, collector, ' ')

    if (
      thing.source &&
      (thing.source.left ||
        (thing.source.right && thing.source.right.filter(Boolean).length > 0))
    ) {
      collector.append(' FROM ')
      collector = this.visit(thing.source, collector)
    }

    collector = this.collectNodesFor(
      thing.wheres,
      collector,
      ' WHERE ',
      ' AND ',
    )

    collector = this.collectNodesFor(thing.groups, collector, ' GROUP BY ')

    collector = this.collectNodesFor(
      thing.havings,
      collector,
      ' HAVING ',
      ' AND ',
    )

    collector = this.collectNodesFor(thing.windows, collector, ' WINDOW ')

    collector = this.maybeVisit(thing.comment, collector)

    return collector
  }

  protected visitSelectManager(
    thing: SelectManager,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('(')
    collector = this.visit(thing.ast, collector)
    collector.append(')')

    return collector
  }

  protected visitSelectStatement(
    thing: SelectStatement,
    col: Collector,
  ): Collector {
    let collector = col

    if (thing.with) {
      collector = this.visit(thing.with, collector)
      collector.append(' ')
    }

    collector = thing.cores.reduce(
      (coreCol, core) => this.visitSelectCore(core, coreCol),
      collector,
    )

    if (thing.orders.length > 0) {
      collector.append(' ORDER BY ')
      thing.orders.forEach((order, i) => {
        if (i !== 0) {
          collector.append(', ')
        }
        collector = this.visit(order, collector)
      })
    }

    collector = this.maybeVisit(thing.limit, collector)

    collector = this.maybeVisit(thing.offset, collector)

    collector = this.maybeVisit(thing.lock, collector)

    return collector
  }

  protected visitSQLLiteral(thing: SQLLiteral, col: Collector): Collector {
    return this.literal(thing, col)
  }

  protected visitString(thing: string, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitStringJoin(thing: StringJoin, col: Collector): Collector {
    return this.visit(thing.left, col)
  }

  protected visitSubtraction(thing: Subtraction, col: Collector): Collector {
    return this.visitInfixOperation(thing, col)
  }

  protected visitSum(thing: Sum, col: Collector): Collector {
    return this.aggregate('SUM', thing, col)
  }

  protected visitSymbol(thing: symbol, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitTable(thing: Table, col: Collector): Collector {
    if (thing.tableAlias) {
      return col.append(
        `${this.quoteTableName(String(thing.name))} ${this.quoteTableName(
          String(thing.tableAlias),
        )}`,
      )
    }

    return col.append(this.quoteTableName(String(thing.name)))
  }

  protected visitTableAlias(thing: TableAlias, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.relation, collector)
    collector.append(' ')
    collector.append(this.quoteTableName(thing.name))

    return collector
  }

  protected visitTrue(_: True, col: Collector): Collector {
    return col.append('TRUE')
  }

  protected visitUnaryOperation(
    thing: UnaryOperation,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(` ${thing.operator} `)
    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitUnion(thing: Union, col: Collector): Collector {
    let collector = col

    collector = this.infixValueWithParen(thing, collector, ' UNION ')

    return collector
  }

  protected visitUnionAll(thing: UnionAll, col: Collector): Collector {
    let collector = col

    collector = this.infixValueWithParen(thing, col, ' UNION ALL ')

    return collector
  }

  protected visitUnqualifiedColumn(
    thing: UnqualifiedColumn,
    col: Collector,
  ): Collector {
    return col.append(this.quoteColumnName(thing.name))
  }

  protected visitUpdateStatement(
    thing: UpdateStatement,
    col: Collector,
  ): Collector {
    let collector = col

    const obj = this.prepareUpdateStatement(thing)

    collector.append('UPDATE ')

    collector = this.visit(obj.relation, collector)

    collector = this.collectNodesFor(obj.values, collector, ' SET ')
    collector = this.collectNodesFor(obj.wheres, collector, ' WHERE ', ' AND ')
    collector = this.collectNodesFor(obj.orders, collector, ' ORDER BY ')

    collector = this.maybeVisit(obj.limit, collector)

    return collector
  }

  protected visitValuesList(thing: ValuesList, col: Collector): Collector {
    let collector = col

    collector.append('VALUES ')

    thing.rows.forEach((row, i: number) => {
      const values = Object.entries(row)

      if (i !== 0) {
        collector.append(', ')
      }
      collector.append('(')
      values.forEach(([_, value], k: number) => {
        if (k !== 0) {
          collector.append(', ')
        }

        if (value instanceof BindParam || value instanceof SQLLiteral) {
          collector = this.visit(value, collector)
        } else {
          collector.append(String(this.quote(value)))
        }
      })
      collector.append(')')
    })

    return collector
  }

  protected visitWhen(thing: When, col: Collector): Collector {
    let collector = col

    collector.append('WHEN ')
    collector = this.visit(thing.left, collector)
    collector.append(' THEN ')
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitWindow(thing: Window, col: Collector): Collector {
    let collector = col

    collector.append('(')

    collector = this.collectNodesFor(
      thing.partitions,
      collector,
      'PARTITION BY ',
    )

    if (thing.orders.length > 0) {
      if (thing.partitions.length > 0) {
        collector.append(' ')
      }
      collector.append('ORDER BY ')
      collector = this.injectJoin(thing.orders, collector, ', ')
    }

    if (thing.framing) {
      if (thing.partitions.length > 0 || thing.orders.length > 0) {
        collector.append(' ')
      }
      collector = this.visit(thing.framing, collector)
    }

    collector.append(')')

    return collector
  }

  protected visitWith(thing: With, col: Collector): Collector {
    let collector = col

    collector.append('WITH ')
    collector = this.injectJoin(thing.children, collector, ', ')

    return collector
  }

  protected visitWithRecursive(
    thing: WithRecursive,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append('WITH RECURSIVE ')
    collector = this.injectJoin(thing.children, collector, ', ')

    return collector
  }
}
