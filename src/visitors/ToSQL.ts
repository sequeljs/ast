// prettier-ignore
import {
  AND, AS, ASC, AVG, BETWEEN, CASE, COMMA, COUNT, CURRENT_ROW, DELETE_FROM,
  DESC, DISTINCT, ELSE, END, EQUAL, ESCAPE, EXCEPT, EXISTS, EXTRACT, FALSE,
  FALSEY, FOLLOWING, FROM, FULL_OUTER_JOIN, GREATER_THAN, GREATER_THAN_OR_EQUAL,
  GROUP_BY, HAVING, IN, INNER_JOIN, INSERT_INTO, INTERSECT, IS_NOT_NULL,
  IS_NULL, LEFT_OUTER_JOIN, LESS_THAN, LESS_THAN_OR_EQUAL, LIKE, LIMIT, MAX,
  MIN, NOT, NOT_EQUAL, NOT_IN, NOT_LIKE, OFFSET, ON, OR, ORDER_BY, OVER,
  PARTITION_BY, PRECEDING, RANGE, RIGHT_OUTER_JOIN, ROWS, SELECT, SET, SPACE,
  SUM, THEN, TRUE, TRUTHY, UNBOUNDED, UNION, UNION_ALL, UPDATE, VALUES, WHEN,
  WHERE, WINDOW, WITH, WITH_RECURSIVE,
} from './constants'

import Attribute from '../attributes/Attribute'

import SQLString from '../collectors/SQLString'

import VisitorNotImplementedError from '../errors/VisitorNotImplementedError'
import VisitorNotSupportedError from '../errors/VisitorNotSupportedError'

import BindParam from '../nodes/BindParam'
import Grouping from '../nodes/Grouping'
import In from '../nodes/In'
import SQLLiteral from '../nodes/SQLLiteral'
import SelectStatement from '../nodes/SelectStatement'
import TableAlias from '../nodes/TableAlias'
import UnqualifiedColumn from '../nodes/UnqualifiedColumn'

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
import type Binary from '../nodes/Binary'
import type Case from '../nodes/Case'
import type Casted from '../nodes/Casted'
import type Count from '../nodes/Count'
import type CurrentRow from '../nodes/CurrentRow'
import type DeleteStatement from '../nodes/DeleteStatement'
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
import type JoinSource from '../nodes/JoinSource'
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
import type Top from '../nodes/Top'
import type True from '../nodes/True'
import type UnaryOperation from '../nodes/UnaryOperation'
import type Union from '../nodes/Union'
import type UnionAll from '../nodes/UnionAll'
import type UpdateStatement from '../nodes/UpdateStatement'
import type Values from '../nodes/Values'
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
import type VisitableLiteral from './VisitableLiteral'

function buildSubselect(key: string, thing: UpdateStatement): SelectStatement {
  const stmt = new SelectStatement()

  const core = stmt.cores[0]
  core.from = thing.relation
  core.wheres = thing.wheres
  core.projections = [key]

  stmt.limit = thing.limit
  stmt.orders = thing.orders

  return stmt
}

export default class ToSQL extends Visitor {
  connection: Connection

  constructor(connection: Connection) {
    super()

    this.connection = connection
  }

  compile(node: Visitable): string | string[] {
    return this.accept(node, new SQLString()).value
  }

  protected aggregate(
    name: string,
    thing: SQLFunction,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(`${name}(`)
    if (thing.distinct) {
      collector.append(`${DISTINCT} `)
    }
    collector = this.injectJoin(thing.expressions, collector, COMMA)
    collector.append(')')

    if (thing.alias) {
      collector.append(AS)
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected collectNodesFor(
    nodes: Visitable[],
    col: Collector,
    spacer: string,
    connector: string = COMMA,
  ): Collector {
    let collector = col

    if (nodes.length > 0) {
      collector.append(spacer)
      const len = nodes.length - 1
      nodes.forEach((node, i) => {
        collector = this.visit(node, collector)
        if (i !== len) {
          collector.append(connector)
        }
      })
    }

    return collector
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

  protected injectJoin(
    things: Visitable[],
    col: Collector,
    joinStr: string,
  ): Collector {
    const len = things.length - 1

    return things.reduce(
      (collector: Collector, thing: Visitable, index: number) => {
        if (index === len) {
          return this.visit(thing, collector)
        }

        return this.visit(thing, collector).append(joinStr)
      },
      col,
    )
  }

  protected literal(thing: VisitableLiteral, col: Collector): Collector {
    return col.append(String(thing))
  }

  protected maybeVisit(thing: Visitable, col: Collector): Collector {
    let collector = col

    if (!thing) {
      return collector
    }

    collector.append(SPACE)
    collector = this.visit(thing, collector)

    return collector
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

  protected unsupported(thing: unknown, _: Collector): Collector {
    throw new VisitorNotSupportedError(typeof thing)
  }

  protected visitAddition(thing: Addition, col: Collector): Collector {
    return this.visitInfixOperation(thing, col)
  }

  protected visitAnd(thing: And, col: Collector): Collector {
    return this.injectJoin(thing.children, col, AND)
  }

  protected visitArray(things: Array<Visitable>, col: Collector): Collector {
    return this.injectJoin(things, col, COMMA)
  }

  protected visitAs(thing: As, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(AS)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitAscending(thing: Ascending, col: Collector): Collector {
    return this.visit(thing.expr, col).append(ASC)
  }

  protected visitAssignment(thing: Assignment, col: Collector): Collector {
    let collector = col

    if (
      thing.right instanceof Attribute ||
      thing.right instanceof BindParam ||
      thing.right instanceof UnqualifiedColumn
    ) {
      collector = this.visit(thing.left, collector)
      collector.append(EQUAL)
      collector = this.visit(thing.right, collector)

      return collector
    }

    collector = this.visit(thing.left, collector)
    collector.append(EQUAL)
    collector.append(String(this.quote(thing.right)))

    return collector
  }

  protected visitAttributesAttribute(
    thing: Attribute,
    col: Collector,
  ): Collector {
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

    return col.append(
      `${this.quoteTableName(joinName)}.${this.quoteColumnName(thing.name)}`,
    )
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
    return this.aggregate(AVG, thing, col)
  }

  protected visitBetween(thing: Between, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(BETWEEN)
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

    collector.append(CASE)

    if (thing.case) {
      collector = this.visit(thing.case, collector)
      collector.append(SPACE)
    }

    thing.conditions.forEach((condition) => {
      collector = this.visit(condition, collector)
      collector.append(SPACE)
    })

    if (thing.default) {
      collector = this.visit(thing.default, collector)
      collector.append(SPACE)
    }

    collector.append(END)

    return collector
  }

  protected visitCasted(thing: Casted, col: Collector): Collector {
    return col.append(String(this.quoted(thing.value, thing.attribute)))
  }

  protected visitCount(thing: Count, col: Collector): Collector {
    return this.aggregate(COUNT, thing, col)
  }

  protected visitCurrentRow(_: CurrentRow, col: Collector): Collector {
    return col.append(CURRENT_ROW)
  }

  protected visitDate(thing: Date, col: Collector): Collector {
    return this.unsupported(thing, col)
  }

  protected visitDeleteStatement(
    thing: DeleteStatement,
    col: Collector,
  ): Collector {
    let collector = col
    collector.append(DELETE_FROM)

    collector = this.visit(thing.relation, collector)
    if (thing.wheres.length > 0) {
      collector.append(WHERE)

      collector = this.injectJoin(thing.wheres, collector, AND)
    }

    collector = this.maybeVisit(thing.limit, collector)

    return collector
  }

  protected visitDescending(thing: Descending, col: Collector): Collector {
    return this.visit(thing.expr, col).append(DESC)
  }

  protected visitDistinct(thing: Distinct, col: Collector): Collector {
    return col.append(DISTINCT)
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
    collector.append(NOT_LIKE)
    collector = this.visit(thing.right, collector)

    if (thing.escape) {
      collector.append(ESCAPE)
      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitElse(thing: Else, col: Collector): Collector {
    let collector = col

    collector.append(ELSE)
    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitEquality(thing: Equality, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)

    if (
      thing.right === null ||
      ('value' in thing.right && thing.right.value === null)
    ) {
      collector.append(IS_NULL)

      return collector
    }

    collector.append(EQUAL)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitExcept(thing: Except, col: Collector): Collector {
    let collector = col

    collector.append('(')
    collector.append(SPACE)
    collector = this.infixValue(thing, col, EXCEPT)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitExists(thing: Exists, col: Collector): Collector {
    let collector = col

    collector.append(`${EXISTS}(`)
    collector = this.visit(thing.expressions, collector)
    collector.append(')')

    if (thing.alias) {
      collector.append(AS)
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected visitExtract(thing: Extract, col: Collector): Collector {
    let collector = col

    collector.append(`${EXTRACT}(${String(thing.field).toUpperCase()}${FROM}`)
    collector = this.visit(thing.expr, collector)
    collector.append(')')

    return collector
  }

  protected visitFalse(_: False, col: Collector): Collector {
    return col.append(FALSE)
  }

  protected visitFollowing(thing: Following, col: Collector): Collector {
    let collector = col

    collector = thing.expr
      ? this.visit(thing.expr, collector)
      : collector.append(UNBOUNDED)

    collector.append(FOLLOWING)

    return collector
  }

  protected visitFullOuterJoin(
    thing: FullOuterJoin,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(FULL_OUTER_JOIN)
    collector = this.visit(thing.left, collector)
    collector.append(SPACE)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitGreaterThan(thing: GreaterThan, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(GREATER_THAN)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitGreaterThanOrEqual(
    thing: GreaterThanOrEqual,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(GREATER_THAN_OR_EQUAL)
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
    let collector = col

    if (Array.isArray(thing.right) && thing.right.length <= 0) {
      return collector.append(FALSEY)
    }

    collector = this.visit(thing.left, collector)
    collector.append(IN)
    collector.append('(')
    collector = this.visit(thing.right, collector)
    collector.append(')')

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

    collector.append(INNER_JOIN)
    collector = this.visit(thing.left, collector)

    if (thing.right) {
      collector.append(SPACE)
      collector = this.visit(thing.right, collector)
    }

    return collector
  }

  protected visitInsertStatement(
    thing: InsertStatement,
    col: Collector,
  ): Collector {
    let collector = col
    collector.append(INSERT_INTO)

    collector = this.visit(thing.relation, collector)

    if (thing.columns.length > 0) {
      collector.append(
        ` (${thing.columns
          .map((c) => this.quoteColumnName(c.name))
          .join(', ')})`,
      )
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

    collector.append('(')
    collector.append(SPACE)
    collector = this.infixValue(thing, col, INTERSECT)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitJoinSource(thing: JoinSource, col: Collector): Collector {
    let collector = col

    if (thing.left) {
      collector = this.visit(thing.left, collector)
    }

    if (thing.right.length > 0) {
      if (thing.left) {
        collector.append(SPACE)
      }

      collector = this.injectJoin(thing.right, collector, SPACE)
    }

    return collector
  }

  protected visitLessThan(thing: LessThan, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(LESS_THAN)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitLessThanOrEqual(
    thing: LessThanOrEqual,
    col: Collector,
  ): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(LESS_THAN_OR_EQUAL)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitLimit(thing: Limit, col: Collector): Collector {
    let collector = col

    collector.append(LIMIT)
    collector = this.visit(thing.expr, col)

    return collector
  }

  protected visitLock(thing: Lock, col: Collector): Collector {
    return this.visit(thing.expr, col)
  }

  protected visitMatches(thing: Matches, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(LIKE)
    collector = this.visit(thing.right, collector)

    if (thing.escape) {
      collector.append(ESCAPE)
      collector = this.visit(thing.escape, collector)
    }

    return collector
  }

  protected visitMax(thing: Max, col: Collector): Collector {
    return this.aggregate(MAX, thing, col)
  }

  protected visitMin(thing: Min, col: Collector): Collector {
    return this.aggregate(MIN, thing, col)
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
      collector.append(`${DISTINCT} `)
    }
    collector = this.injectJoin(thing.expressions, collector, COMMA)
    collector.append(')')
    if (thing.alias) {
      collector.append(AS)
      collector = this.visit(thing.alias, collector)
    }

    return collector
  }

  protected visitNamedWindow(thing: NamedWindow, col: Collector): Collector {
    let collector = col

    collector.append(this.quoteColumnName(thing.name))
    collector.append(AS)
    collector = this.visitWindow(thing, collector)

    return collector
  }

  protected visitNot(thing: Not, col: Collector): Collector {
    let collector = col

    collector.append(`${NOT}(`)
    collector = this.visit(thing.expr, collector)
    collector.append(')')

    return collector
  }

  protected visitNotEqual(thing: NotEqual, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)

    if (
      thing.right === null ||
      ('value' in thing.right && thing.right.value === null)
    ) {
      collector.append(IS_NOT_NULL)

      return collector
    }

    collector.append(NOT_EQUAL)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitNotIn(thing: NotIn, col: Collector): Collector {
    let collector = col

    if (Array.isArray(thing.right) && thing.right.length <= 0) {
      return collector.append(TRUTHY)
    }

    collector = this.visit(thing.left, collector)
    collector.append(NOT_IN)
    collector.append('(')
    collector = this.visit(thing.right, collector)
    collector.append(')')

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

    collector.append(OFFSET)
    collector = this.visit(thing.expr, col)

    return collector
  }

  protected visitOn(thing: On, col: Collector): Collector {
    let collector = col

    collector.append(ON)
    collector = this.visit(thing.expr, collector)

    return collector
  }

  protected visitOr(thing: Or, col: Collector): Collector {
    let collector = col

    collector = this.visit(thing.left, collector)
    collector.append(OR)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitOuterJoin(thing: OuterJoin, col: Collector): Collector {
    let collector = col

    collector.append(LEFT_OUTER_JOIN)
    collector = this.visit(thing.left, collector)
    collector.append(SPACE)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitOver(thing: Over, col: Collector): Collector {
    if (!thing.right) {
      return this.visit(thing.left, col).append(`${OVER}()`)
    }

    if (thing.right instanceof SQLLiteral) {
      return this.infixValue(thing, col, OVER)
    }

    if (typeof thing.right === 'string') {
      return this.visit(thing.left, col).append(
        `${OVER}${this.quoteColumnName(thing.right)}`,
      )
    }

    return this.infixValue(thing, col, OVER)
  }

  protected visitPreceding(thing: Preceding, col: Collector): Collector {
    let collector = col

    collector = thing.expr
      ? this.visit(thing.expr, collector)
      : collector.append(UNBOUNDED)

    collector.append(PRECEDING)

    return collector
  }

  protected visitQuoted(thing: Quoted, col: Collector): Collector {
    return col.append(String(this.quoted(thing.expr, null)))
  }

  protected visitRange(thing: Range, col: Collector): Collector {
    let collector = col

    if (thing.expr) {
      collector.append(`${RANGE} `)
      collector = this.visit(thing.expr, collector)

      return collector
    }

    collector.append(RANGE)

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

    collector.append(RIGHT_OUTER_JOIN)
    collector = this.visit(thing.left, collector)
    collector.append(SPACE)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitRows(thing: Rows, col: Collector): Collector {
    let collector = col

    if (thing.expr) {
      collector.append(`${ROWS} `)
      collector = this.visit(thing.expr, collector)

      return collector
    }

    collector.append(ROWS)

    return collector
  }

  protected visitSelectCore(thing: SelectCore, col: Collector): Collector {
    let collector = col

    collector.append(SELECT)

    collector = this.maybeVisit(thing.top, collector)

    collector = this.maybeVisit(thing.setQuantifier, collector)

    collector = this.collectNodesFor(thing.projections, collector, SPACE)

    if (
      thing.source &&
      (thing.source.left ||
        (thing.source.right && thing.source.right.filter(Boolean).length > 0))
    ) {
      collector.append(FROM)
      collector = this.visit(thing.source, collector)
    }

    collector = this.collectNodesFor(thing.wheres, collector, WHERE, AND)

    collector = this.collectNodesFor(thing.groups, collector, GROUP_BY)

    if (thing.havings.length > 0) {
      collector.append(HAVING)
      this.injectJoin(thing.havings, collector, AND)
    }

    collector = this.collectNodesFor(thing.windows, collector, WINDOW)

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
      collector.append(SPACE)
    }

    collector = thing.cores.reduce(
      (coreCol, core) => this.visitSelectCore(core, coreCol),
      collector,
    )

    if (thing.orders.length > 0) {
      collector.append(SPACE)
      collector.append(ORDER_BY)
      collector.append(SPACE)

      const len = thing.orders.length - 1
      thing.orders.forEach((order, i) => {
        collector = this.visit(order, collector)
        if (i !== len) {
          collector.append(COMMA)
        }
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
    return this.aggregate(SUM, thing, col)
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
    collector.append(SPACE)
    collector.append(this.quoteTableName(thing.name))

    return collector
  }

  protected visitTop(_: Top, col: Collector): Collector {
    return col
  }

  protected visitTrue(_: True, col: Collector): Collector {
    return col.append(TRUE)
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

    collector.append('(')
    collector.append(SPACE)
    collector = this.infixValue(thing, col, UNION)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitUnionAll(thing: UnionAll, col: Collector): Collector {
    let collector = col

    collector.append('(')
    collector.append(SPACE)
    collector = this.infixValue(thing, col, UNION_ALL)
    collector.append(SPACE)
    collector.append(')')

    return collector
  }

  protected visitUnqualifiedColumn(
    thing: UnqualifiedColumn,
    col: Collector,
  ): Collector {
    return col.append(`${this.quoteColumnName(thing.name)}`)
  }

  protected visitUpdateStatement(
    thing: UpdateStatement,
    col: Collector,
  ): Collector {
    let collector = col

    let wheres
    if (thing.orders.length <= 0 && !thing.limit) {
      wheres = thing.wheres
    } else {
      wheres = [new In(thing.key, [buildSubselect(thing.key, thing)])]
    }

    collector.append(UPDATE)

    collector = this.visit(thing.relation, collector)

    if (thing.values.length > 0) {
      collector.append(SET)
      collector = this.injectJoin(thing.values, collector, COMMA)
    }

    if (wheres.length > 0) {
      collector.append(WHERE)
      collector = this.injectJoin(wheres, collector, AND)
    }

    return collector
  }

  protected visitValues(thing: Values, col: Collector): Collector {
    let collector = col

    collector.append(VALUES)
    collector.append('(')

    const len = thing.expressions.length - 1
    thing.expressions.forEach((value: Visitable, i: number) => {
      if (value instanceof BindParam || value instanceof SQLLiteral) {
        collector = this.visit(value, collector)
      } else {
        collector.append(String(this.quote(value)))
      }

      if (i !== len) {
        collector.append(COMMA)
      }
    })

    collector.append(')')

    return collector
  }

  protected visitValuesList(thing: ValuesList, col: Collector): Collector {
    let collector = col

    collector.append(VALUES)

    const len = thing.rows.length - 1
    thing.rows.forEach((row, i) => {
      const values = Object.entries(row)

      collector.append('(')
      const rowLen = values.length - 1
      values.forEach(([_, value], j) => {
        if (value instanceof BindParam || value instanceof SQLLiteral) {
          collector = this.visit(value, collector)
        } else {
          collector.append(String(this.quote(value)))
        }

        if (j !== rowLen) {
          collector.append(COMMA)
        }
      })
      collector.append(')')

      if (i !== len) {
        collector.append(COMMA)
      }
    })

    return collector
  }

  protected visitWhen(thing: When, col: Collector): Collector {
    let collector = col

    collector.append(WHEN)
    collector = this.visit(thing.left, collector)
    collector.append(THEN)
    collector = this.visit(thing.right, collector)

    return collector
  }

  protected visitWindow(thing: Window, col: Collector): Collector {
    let collector = col

    collector.append('(')

    if (thing.partitions.length > 0) {
      collector.append(PARTITION_BY)
      collector = this.injectJoin(thing.partitions, collector, COMMA)
    }

    if (thing.orders.length > 0) {
      if (thing.partitions.length > 0) {
        collector.append(SPACE)
      }
      collector.append(ORDER_BY)
      collector.append(SPACE)
      collector = this.injectJoin(thing.orders, collector, COMMA)
    }

    if (thing.framing) {
      if (thing.partitions.length > 0 || thing.orders.length > 0) {
        collector.append(SPACE)
      }
      collector = this.visit(thing.framing, collector)
    }

    collector.append(')')

    return collector
  }

  protected visitWith(thing: With, col: Collector): Collector {
    let collector = col

    collector.append(WITH)
    collector = this.injectJoin(thing.children, collector, COMMA)

    return collector
  }

  protected visitWithRecursive(
    thing: WithRecursive,
    col: Collector,
  ): Collector {
    let collector = col

    collector.append(WITH_RECURSIVE)
    collector = this.injectJoin(thing.children, collector, COMMA)

    return collector
  }
}
