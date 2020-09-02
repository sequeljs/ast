import '../helper.js'

import Attribute from '../../src/attributes/Attribute.js'
import AttributeBoolean from '../../src/attributes/Boolean.js'
import AttributeDecimal from '../../src/attributes/Decimal.js'
import AttributeFloat from '../../src/attributes/Float.js'
import AttributeInteger from '../../src/attributes/Integer.js'
import AttributeString from '../../src/attributes/String.js'
import AttributeTime from '../../src/attributes/Time.js'

import SQLString from '../../src/collectors/SQLString.js'

import VisitorError from '../../src/errors/VisitorError.js'
import VisitorNotImplementedError from '../../src/errors/VisitorNotImplementedError.js'
import VisitorNotSupportedError from '../../src/errors/VisitorNotSupportedError.js'

import Engine from '../../src/interfaces/Engine.js'

import And from '../../src/nodes/And.js'
import As from '../../src/nodes/As.js'
import Assignment from '../../src/nodes/Assignment.js'
import Avg from '../../src/nodes/Avg.js'
import BindParam from '../../src/nodes/BindParam.js'
import Case from '../../src/nodes/Case.js'
import Count from '../../src/nodes/Count.js'
import DistinctOn from '../../src/nodes/DistinctOn.js'
import Equality from '../../src/nodes/Equality.js'
import Grouping from '../../src/nodes/Grouping.js'
import InfixOperation from '../../src/nodes/InfixOperation.js'
import IsDistinctFrom from '../../src/nodes/IsDistinctFrom.js'
import IsNotDistinctFrom from '../../src/nodes/IsNotDistinctFrom.js'
import Limit from '../../src/nodes/Limit.js'
import Max from '../../src/nodes/Max.js'
import Min from '../../src/nodes/Min.js'
import NamedSQLFunction from '../../src/nodes/NamedSQLFunction.js'
import Node from '../../src/nodes/Node.js'
import Not from '../../src/nodes/Not.js'
import NotEqual from '../../src/nodes/NotEqual.js'
import NotRegexp from '../../src/nodes/NotRegexp.js'
import Or from '../../src/nodes/Or.js'
import Regexp from '../../src/nodes/Regexp.js'
import SQLFunction from '../../src/nodes/SQLFunction.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'
import SelectCore from '../../src/nodes/SelectCore.js'
import SelectStatement from '../../src/nodes/SelectStatement.js'
import Sum from '../../src/nodes/Sum.js'
import TableAlias from '../../src/nodes/TableAlias.js'
import UnaryOperation from '../../src/nodes/UnaryOperation.js'
import UnqualifiedColumn from '../../src/nodes/UnqualifiedColumn.js'
import ValuesList from '../../src/nodes/ValuesList.js'
import buildQuoted from '../../src/nodes/buildQuoted.js'

import ToSQL from '../../src/visitors/ToSQL.js'
import Visitable from '../../src/visitors/Visitable.js'

import Table from '../../src/Table.js'

import FakeConnection from '../support/FakeConnection.js'
import FakeNode from '../support/FakeNode.js'
import FakeRecord from '../support/FakeRecord.js'

const scope: {
  attribute: Attribute
  engine: Engine
  table: Table
  visitor: ToSQL
} = {
  attribute: new Attribute(new Table(''), ''),
  engine: new FakeRecord(),
  table: new Table(''),
  visitor: new ToSQL(new FakeConnection()),
}

function compile(node: Visitable | null): string | null {
  if (scope.visitor) {
    return scope.visitor.accept(node, new SQLString()).value
  }

  return null
}

describe('ToSQL', () => {
  beforeEach(() => {
    scope.engine = new FakeRecord()
    scope.visitor = new ToSQL(scope.engine.connection)
    scope.table = new Table('users')
    scope.attribute = scope.table.get('id')
  })

  test('compiles', () => {
    expect(scope.visitor.compile(scope.table)).toStrictEqual(`"users"`)
  })

  test('works with BindParams', () => {
    const node = new BindParam(1)

    expect(compile(node)).toStrictEqual(`?`)
  })

  test('does not quote BindParams used as part of a Values', () => {
    const bp = new BindParam(1)
    const values = new ValuesList([[bp]])

    expect(compile(values)).toStrictEqual(`VALUES (?)`)
  })

  test('should not quote SQLLiterals', () => {
    const node = scope.table.get(new SQLLiteral('*'))

    expect(compile(node)).toStrictEqual(`"users".*`)
  })

  test('should visit named functions', () => {
    const sqlFunction = new NamedSQLFunction('omg', [new SQLLiteral('*')])

    expect(compile(sqlFunction)).toStrictEqual(`omg(*)`)
  })

  test('should handle distinct with named functions', () => {
    const sqlFunction = new NamedSQLFunction('omg', [new SQLLiteral('*')])
    sqlFunction.distinct = true

    expect(compile(sqlFunction)).toStrictEqual(`omg(DISTINCT *)`)
  })

  test('should handle alias on named functions', () => {
    let sqlFunction = new NamedSQLFunction('omg', [new SQLLiteral('*')])
    sqlFunction = sqlFunction.as('wth')

    expect(compile(sqlFunction)).toStrictEqual('omg(*) AS wth')
  })

  test('should chain predications on named functions', () => {
    const sqlFunction = new NamedSQLFunction('omg', [new SQLLiteral('*')])

    expect(compile(sqlFunction.eq(2))).toStrictEqual(`omg(*) = 2`)
  })

  test('should handle null with named functions', () => {
    const sqlFunction = new NamedSQLFunction('omg', [new SQLLiteral('*')])

    expect(compile(sqlFunction.eq(null))).toStrictEqual(`omg(*) IS NULL`)
  })

  test('should visit built-in functions', () => {
    let sqlFunction: SQLFunction

    sqlFunction = new Count([new SQLLiteral('*')])
    expect(compile(sqlFunction)).toStrictEqual(`COUNT(*)`)

    sqlFunction = new Sum([new SQLLiteral('*')])
    expect(compile(sqlFunction)).toStrictEqual(`SUM(*)`)

    sqlFunction = new Max([new SQLLiteral('*')])
    expect(compile(sqlFunction)).toStrictEqual(`MAX(*)`)

    sqlFunction = new Min([new SQLLiteral('*')])
    expect(compile(sqlFunction)).toStrictEqual(`MIN(*)`)

    sqlFunction = new Avg([new SQLLiteral('*')])
    expect(compile(sqlFunction)).toStrictEqual(`AVG(*)`)
  })

  test('should visit built-in functions operating on distinct values', () => {
    let sqlFunction: SQLFunction

    sqlFunction = new Count([new SQLLiteral('*')])
    sqlFunction.distinct = true
    expect(compile(sqlFunction)).toStrictEqual(`COUNT(DISTINCT *)`)

    sqlFunction = new Sum([new SQLLiteral('*')])
    sqlFunction.distinct = true
    expect(compile(sqlFunction)).toStrictEqual(`SUM(DISTINCT *)`)

    sqlFunction = new Max([new SQLLiteral('*')])
    sqlFunction.distinct = true
    expect(compile(sqlFunction)).toStrictEqual(`MAX(DISTINCT *)`)

    sqlFunction = new Min([new SQLLiteral('*')])
    sqlFunction.distinct = true
    expect(compile(sqlFunction)).toStrictEqual(`MIN(DISTINCT *)`)

    sqlFunction = new Avg([new SQLLiteral('*')])
    sqlFunction.distinct = true
    expect(compile(sqlFunction)).toStrictEqual(`AVG(DISTINCT *)`)
  })

  test('works with lists', () => {
    const sqlFunction = new NamedSQLFunction('omg', [
      new SQLLiteral('*'),
      new SQLLiteral('*'),
    ])
    expect(compile(sqlFunction)).toStrictEqual(`omg(*, *)`)
  })

  describe('Equality', () => {
    test('should escape strings', () => {
      const node = scope.table.get('name').eq('Aaron Patterson')

      expect(compile(node)).toStrictEqual(`"users"."name" = 'Aaron Patterson'`)
    })

    test('should handle false', () => {
      const val = buildQuoted(false, scope.table.get('active'))

      const node = new Equality(val, val)

      expect(compile(node)).toStrictEqual(`'f' = 'f'`)
    })

    test('should handle null', () => {
      const node = new Equality(scope.table.get('name'), null)

      expect(compile(node)).toStrictEqual(`"users"."name" IS NULL`)
    })
  })

  describe('Grouping', () => {
    test('wraps nested groupings in brackets only once', () => {
      const node = new Grouping(new Grouping(buildQuoted('foo')))

      expect(compile(node)).toStrictEqual(`('foo')`)
    })
  })

  describe('NotEqual', () => {
    test('should handle false', () => {
      const val = buildQuoted(false, scope.table.get('active'))
      const node = new NotEqual(scope.table.get('active'), val)

      expect(compile(node)).toStrictEqual(`"users"."active" != 'f'`)
    })

    test('should handle null', () => {
      const val = buildQuoted(null, scope.table.get('active'))
      const node = new NotEqual(scope.table.get('name'), val)

      expect(compile(node)).toStrictEqual(`"users"."name" IS NOT NULL`)
    })
  })

  describe('IsDistinctFrom', () => {
    test('should handle column names on both sides', () => {
      const node = new Table('users')
        .get('first_name')
        .isDistinctFrom(new Table('users').get('last_name'))

      expect(compile(node)).toStrictEqual(
        `CASE WHEN "users"."first_name" = "users"."last_name" OR ("users"."first_name" IS NULL AND "users"."last_name" IS NULL) THEN 0 ELSE 1 END = 1`,
      )
    })

    test('should handle null', () => {
      const node = new IsDistinctFrom(
        scope.table.get('name'),
        buildQuoted(null, scope.table.get('active')),
      )

      expect(compile(node)).toStrictEqual(`"users"."name" IS NOT NULL`)
    })
  })

  describe('IsNotDistinctFrom', () => {
    test('should construct a valid generic SQL statement', () => {
      const node = new Table('users')
        .get('name')
        .isNotDistinctFrom('Aaron Patterson')

      expect(compile(node)).toStrictEqual(
        `CASE WHEN "users"."name" = 'Aaron Patterson' OR ("users"."name" IS NULL AND 'Aaron Patterson' IS NULL) THEN 0 ELSE 1 END = 0`,
      )
    })

    test('should handle column names on both sides', () => {
      const node = new Table('users')
        .get('first_name')
        .isNotDistinctFrom(new Table('users').get('last_name'))

      expect(compile(node)).toStrictEqual(
        `CASE WHEN "users"."first_name" = "users"."last_name" OR ("users"."first_name" IS NULL AND "users"."last_name" IS NULL) THEN 0 ELSE 1 END = 0`,
      )
    })

    test('should handle null', () => {
      const node = new IsNotDistinctFrom(
        scope.table.get('name'),
        buildQuoted(null, scope.table.get('active')),
      )

      expect(compile(node)).toStrictEqual(`"users"."name" IS NULL`)
    })
  })

  test('should visit Class', () => {
    expect(compile(buildQuoted(Date))).toStrictEqual(`'Date'`)
  })

  test('should escape LIMIT', () => {
    const stmt = new SelectStatement()
    stmt.limit = new Limit(buildQuoted('omg'))

    expect(compile(stmt)).toMatch(`LIMIT 'omg'`)
  })

  test('should contain a single space before ORDER BY', () => {
    const node = scope.table.order(scope.table.get('name'))

    expect(compile(node)).toMatch(`"users" ORDER BY`)
  })

  test('should quote LIMIT without column type coercion', () => {
    const stmt = scope.table.where(scope.table.get('name').eq(0)).take(1).ast

    expect(compile(stmt)).toMatch(`WHERE "users"."name" = 0 LIMIT 1`)
  })

  test('should visit Date', () => {
    const date = new Date()

    const node = scope.table.get('created_at').eq(date)

    expect(compile(node)).toStrictEqual(
      `"users"."created_at" = '${date
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')}'`,
    )
  })

  test('should visit BigInt', () => {
    const node = new Table('products').get('price').eq(BigInt(2))

    expect(compile(node)).toStrictEqual(`"products"."price" = 2`)
  })

  test('should visit Float', () => {
    const node = new Table('products').get('price').eq(2.14)

    expect(compile(node)).toStrictEqual(`"products"."price" = 2.14`)
  })

  test('should visit Not', () => {
    const node = new Not(new SQLLiteral('foo'))

    expect(compile(node)).toStrictEqual(`NOT (foo)`)
  })

  test('should visit As', () => {
    const as = new As(new SQLLiteral('foo'), new SQLLiteral('bar'))

    expect(compile(as)).toStrictEqual(`foo AS bar`)
  })

  test('should visitNilClass', () => {
    expect(compile(buildQuoted(null))).toStrictEqual(`NULL`)
  })

  test('should apply Not to the whole expression', () => {
    const and = new And([scope.attribute.eq(10), scope.attribute.eq(11)])

    const node = new Not(and)

    expect(compile(node)).toStrictEqual(
      `NOT ("users"."id" = 10 AND "users"."id" = 11)`,
    )
  })

  test('unsupported input should raise VisitorNotSupportedError', () => {
    expect(() => compile('foo')).toThrow(VisitorNotSupportedError)
    expect(() => compile(Symbol('foo'))).toThrow(VisitorNotSupportedError)
    expect(() => compile(new Date())).toThrow(VisitorNotSupportedError)
    expect(() => compile(null)).toThrow(VisitorNotSupportedError)
    expect(() => compile(true)).toThrow(VisitorNotSupportedError)
  })

  test('supported input should compile', () => {
    expect(compile(BigInt(10))).toStrictEqual('10')
  })

  test('unknown Visitable input should raise VisitorError', () => {
    expect(() => compile(new FakeNode())).toThrow(VisitorError)
  })

  test('should visit SelectManager, which is a subquery', () => {
    const mgr = new Table('foo').project('bar')

    expect(compile(mgr)).toMatch(`SELECT bar FROM "foo"`)
  })

  test('should visit And', () => {
    const node = new And([scope.attribute.eq(10), scope.attribute.eq(11)])

    expect(compile(node)).toStrictEqual(
      `"users"."id" = 10 AND "users"."id" = 11`,
    )
  })

  test('should visit Or', () => {
    const node = new Or(scope.attribute.eq(10), scope.attribute.eq(11))

    expect(compile(node)).toStrictEqual(
      `"users"."id" = 10 OR "users"."id" = 11`,
    )
  })

  test('should visit Assignment', () => {
    const column = scope.table.get('id')

    const node = new Assignment(
      new UnqualifiedColumn(column),
      new UnqualifiedColumn(column),
    )

    expect(compile(node)).toStrictEqual(`"id" = "id"`)
  })

  test('should visit Assignment with SQLLiteral', () => {
    const node = new Assignment(new SQLLiteral('id'), new SQLLiteral('1'))

    expect(compile(node)).toStrictEqual(`id = 1`)
  })

  test('should handle TableAlias on Attribute relation', () => {
    scope.attribute.relation.tableAlias = new TableAlias(
      scope.attribute.relation,
      'foo',
    )

    expect(compile(scope.attribute)).toStrictEqual(`"foo"."id"`)
  })

  test('should visit Time', () => {
    const attribute = new AttributeTime(
      scope.attribute.relation,
      scope.attribute.name,
    )

    expect(compile(attribute)).toStrictEqual(`"users"."id"`)
  })

  test('should visit Boolean', () => {
    const node = new Table('users').get('bool').eq(true)

    expect(compile(node)).toStrictEqual(`"users"."bool" = 't'`)
  })

  describe('Matches', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').matches('foo%')

      expect(compile(node)).toStrictEqual(`"users"."name" LIKE 'foo%'`)
    })

    test('can handle ESCAPE', () => {
      const node = scope.table.get('name').matches('foo!%', '!')

      expect(compile(node)).toStrictEqual(
        `"users"."name" LIKE 'foo!%' ESCAPE '!'`,
      )
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').matches('foo%'))

      const node = scope.attribute.inVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" LIKE 'foo%')`,
      )
    })
  })

  describe('DoesNotMatch', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').doesNotMatch('foo%')

      expect(compile(node)).toStrictEqual(`"users"."name" NOT LIKE 'foo%'`)
    })

    test('can handle ESCAPE', () => {
      const node = scope.table.get('name').doesNotMatch('foo!%', '!')

      expect(compile(node)).toStrictEqual(
        `"users"."name" NOT LIKE 'foo!%' ESCAPE '!'`,
      )
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').doesNotMatch('foo%'))

      const node = scope.attribute.inVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" NOT LIKE 'foo%')`,
      )
    })
  })

  describe('Ordering', () => {
    test('should know how to visit Ascending', () => {
      const node = scope.attribute.asc()

      expect(compile(node)).toStrictEqual(`"users"."id" ASC`)
    })

    test('should know how to visit Descending', () => {
      const node = scope.attribute.desc()

      expect(compile(node)).toStrictEqual(`"users"."id" DESC`)
    })
  })

  describe('In', () => {
    test('should know how to visit', () => {
      const node = scope.attribute.inVal([1, 2, 3])

      expect(compile(node)).toStrictEqual(`"users"."id" IN (1, 2, 3)`)
    })

    test('should return 1=0 when empty right which is always false', () => {
      const node = scope.attribute.inVal([])

      expect(compile(node)).toStrictEqual(`1 = 0`)
    })

    test('can handle inclusive ranges', () => {
      const node = scope.attribute.between(1, 3)

      expect(compile(node)).toStrictEqual(`"users"."id" BETWEEN 1 AND 3`)
    })

    test('can handle non-inclusive ranges', () => {
      const node = scope.attribute.between(1, 3, false)

      expect(compile(node)).toStrictEqual(
        `"users"."id" >= 1 AND "users"."id" < 3`,
      )
    })

    test('can handle ranges bounded by infinity', () => {
      let node: Node

      node = scope.attribute.between(1, Infinity)
      expect(compile(node)).toStrictEqual(`"users"."id" >= 1`)

      node = scope.attribute.between(-Infinity, 3)
      expect(compile(node)).toStrictEqual(`"users"."id" <= 3`)

      node = scope.attribute.between(-Infinity, 3, false)
      expect(compile(node)).toStrictEqual(`"users"."id" < 3`)

      node = scope.attribute.between(-Infinity, Infinity)
      expect(compile(node)).toStrictEqual(`1 = 1`)
    })

    test('can handle subqueries', () => {
      const table = new Table('users')
      const subquery = table.project('id').where(table.get('name').eq('Aaron'))
      const node = scope.attribute.inVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" = 'Aaron')`,
      )
    })

    test('can handle inClauseLength', () => {
      const node = scope.attribute.inVal([1, 2, 3, 4, 5, 6])

      expect(compile(node)).toStrictEqual(
        `("users"."id" IN (1, 2, 3) OR "users"."id" IN (4, 5, 6))`,
      )
    })
  })

  describe('InfixOperation', () => {
    test('should handle Multiplication', () => {
      const node = new AttributeDecimal(
        new Table('products'),
        'price',
      ).multiply(new AttributeDecimal(new Table('currency_rates'), 'rate'))

      expect(compile(node)).toStrictEqual(
        `"products"."price" * "currency_rates"."rate"`,
      )
    })

    test('should handle Division', () => {
      const node = new AttributeDecimal(new Table('products'), 'price').divide(
        5,
      )

      expect(compile(node)).toStrictEqual(`"products"."price" / 5`)
    })

    test('should handle Addition', () => {
      const node = new AttributeDecimal(new Table('products'), 'price').add(6)

      expect(compile(node)).toStrictEqual(`("products"."price" + 6)`)
    })

    test('should handle Subtraction', () => {
      const node = new AttributeDecimal(
        new Table('products'),
        'price',
      ).subtract(7)

      expect(compile(node)).toStrictEqual(`("products"."price" - 7)`)
    })

    test('should handle Concatination', () => {
      const table = new Table('users')

      const node = table.get('name').concat(table.get('name'))

      expect(compile(node)).toStrictEqual(`"users"."name" || "users"."name"`)
    })

    test('should handle BitwiseAnd', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseAnd(16)

      expect(compile(node)).toStrictEqual(`("products"."bitmap" & 16)`)
    })

    test('should handle BitwiseOr', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseOr(16)

      expect(compile(node)).toStrictEqual(`("products"."bitmap" | 16)`)
    })

    test('should handle BitwiseXor', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseXor(16)

      expect(compile(node)).toStrictEqual(`("products"."bitmap" ^ 16)`)
    })

    test('should handle BitwiseShiftLeft', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseShiftLeft(4)

      expect(compile(node)).toStrictEqual(`("products"."bitmap" << 4)`)
    })

    test('should handle BitwiseShiftRight', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseShiftRight(4)

      expect(compile(node)).toStrictEqual(`("products"."bitmap" >> 4)`)
    })

    test('should handle arbitrary operators', () => {
      const node = new InfixOperation(
        '&&',
        new AttributeString(new Table('products'), 'name'),
        new AttributeString(new Table('products'), 'name'),
      )

      expect(compile(node)).toStrictEqual(
        `"products"."name" && "products"."name"`,
      )
    })

    test('should handle boolean attributes', () => {
      const node = new InfixOperation(
        'AND',
        new AttributeBoolean(new Table('products'), 'name'),
        new AttributeBoolean(new Table('products'), 'name'),
      )

      expect(compile(node)).toStrictEqual(
        `"products"."name" AND "products"."name"`,
      )
    })

    test('should handle float attributes', () => {
      const node = new InfixOperation(
        'AND',
        new AttributeFloat(new Table('products'), 'name'),
        new AttributeFloat(new Table('products'), 'name'),
      )

      expect(compile(node)).toStrictEqual(
        `"products"."name" AND "products"."name"`,
      )
    })
  })

  describe('UnaryOperation', () => {
    test('should handle BitwiseNot', () => {
      const node = new AttributeInteger(
        new Table('products'),
        'bitmap',
      ).bitwiseNot()

      expect(compile(node)).toStrictEqual(` ~ "products"."bitmap"`)
    })

    test('should handle arbitrary operators', () => {
      const node = new UnaryOperation(
        '!',
        new AttributeString(new Table('products'), 'active'),
      )

      expect(compile(node)).toStrictEqual(` ! "products"."active"`)
    })
  })

  describe('NotIn', () => {
    test('should know how to visit', () => {
      const node = scope.attribute.notInVal([1, 2, 3])

      expect(compile(node)).toStrictEqual(`"users"."id" NOT IN (1, 2, 3)`)
    })

    test('should return 1=1 when empty right which is always true', () => {
      const node = scope.attribute.notInVal([])

      expect(compile(node)).toStrictEqual(`1 = 1`)
    })

    test('can handle inclusive ranges', () => {
      const node = scope.attribute.notBetween(1, 3)

      expect(compile(node)).toStrictEqual(
        `("users"."id" < 1 OR "users"."id" > 3)`,
      )
    })

    test('can handle non-inclusive ranges', () => {
      const node = scope.attribute.notBetween(1, 3, false)

      expect(compile(node)).toStrictEqual(
        `("users"."id" < 1 OR "users"."id" >= 3)`,
      )
    })

    test('can handle ranges bounded by infinity', () => {
      let node: Node

      node = scope.attribute.notBetween(1, Infinity)
      expect(compile(node)).toStrictEqual(`"users"."id" < 1`)

      node = scope.attribute.notBetween(-Infinity, 3)
      expect(compile(node)).toStrictEqual(`"users"."id" > 3`)

      node = scope.attribute.notBetween(-Infinity, 3, false)
      expect(compile(node)).toStrictEqual(`"users"."id" >= 3`)

      node = scope.attribute.notBetween(-Infinity, Infinity)
      expect(compile(node)).toStrictEqual(`1 = 0`)
    })

    test('can handle subqueries', () => {
      const table = new Table('users')
      const subquery = table.project('id').where(table.get('name').eq('Aaron'))

      const node = scope.attribute.notInVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" NOT IN (SELECT id FROM "users" WHERE "users"."name" = 'Aaron')`,
      )
    })

    test('can handle inClauseLength', () => {
      const node = scope.attribute.notInVal([1, 2, 3, 4, 5, 6])

      expect(compile(node)).toStrictEqual(
        `("users"."id" NOT IN (1, 2, 3) AND "users"."id" NOT IN (4, 5, 6))`,
      )
    })
  })

  describe('Constants', () => {
    test('should handle true', () => {
      const node = new Table('users').createTrue()

      expect(compile(node)).toStrictEqual(`TRUE`)
    })

    test('should handle false', () => {
      const node = new Table('users').createFalse()
      expect(compile(node)).toStrictEqual(`FALSE`)
    })
  })

  describe('TableAlias', () => {
    test('should use the underlying table for checking columns', () => {
      const node = new Table('users').alias('zomgusers').get('id').eq('3')

      expect(compile(node)).toStrictEqual(`"zomgusers"."id" = '3'`)
    })
  })

  describe('distinct on', () => {
    test('raises not implemented error', () => {
      const core = new SelectCore()
      core.setQuantifier = new DistinctOn(new SQLLiteral('aaron'))

      expect(() => compile(core)).toThrow(VisitorNotImplementedError)
    })
  })

  describe('Regexp', () => {
    test('raises not implemented error', () => {
      const node = new Regexp(scope.table.get('name'), buildQuoted('foo%'))

      expect(() => compile(node)).toThrow(VisitorNotImplementedError)
    })
  })

  describe('NotRegexp', () => {
    test('raises not implemented error', () => {
      const node = new NotRegexp(scope.table.get('name'), buildQuoted('foo%'))

      expect(() => compile(node)).toThrow(VisitorNotImplementedError)
    })
  })

  describe('Case', () => {
    test('supports simple case expressions', () => {
      const node = new Case(scope.table.get('name')).when('foo').then(1).else(0)

      expect(compile(node)).toStrictEqual(
        `CASE "users"."name" WHEN 'foo' THEN 1 ELSE 0 END`,
      )
    })

    test('supports extended case expressions', () => {
      const node = new Case()
        .when(scope.table.get('name').inVal(['foo', 'bar']))
        .then(1)
        .else(0)

      expect(compile(node)).toStrictEqual(
        `CASE WHEN "users"."name" IN ('foo', 'bar') THEN 1 ELSE 0 END`,
      )
    })

    test('works without default branch', () => {
      const node = new Case(scope.table.get('name')).when('foo').then(1)

      expect(compile(node)).toStrictEqual(
        `CASE "users"."name" WHEN 'foo' THEN 1 END`,
      )
    })

    test('allows chaining multiple conditions', () => {
      const node = new Case(scope.table.get('name'))
        .when('foo')
        .then(1)
        .when('bar')
        .then(2)
        .else(0)

      expect(compile(node)).toStrictEqual(
        `CASE "users"."name" WHEN 'foo' THEN 1 WHEN 'bar' THEN 2 ELSE 0 END`,
      )
    })

    test('supports #when with two arguments and no #then', () => {
      const node = new Case(scope.table.get('name'))

      Object.entries({ foo: 1, bar: 0 }).reduce(
        (_node, pair) => _node.when(...pair),
        node,
      )

      expect(compile(node)).toStrictEqual(
        `CASE "users"."name" WHEN 'foo' THEN 1 WHEN 'bar' THEN 0 END`,
      )
    })

    test('can be chained as a predicate', () => {
      const node = scope.table.get('name').when('foo').then('bar').else('baz')

      expect(compile(node)).toStrictEqual(
        `CASE "users"."name" WHEN 'foo' THEN 'bar' ELSE 'baz' END`,
      )
    })
  })
})
