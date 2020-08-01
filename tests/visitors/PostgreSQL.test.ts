import '../helper'

import Attribute from '../../src/attributes/Attribute'

import SQLString from '../../src/collectors/SQLString'

import BindParam from '../../src/nodes/BindParam'
import Cube from '../../src/nodes/Cube'
import Distinct from '../../src/nodes/Distinct'
import DistinctOn from '../../src/nodes/DistinctOn'
import DoesNotMatch from '../../src/nodes/DoesNotMatch'
import GroupingElement from '../../src/nodes/GroupingElement'
import GroupingSet from '../../src/nodes/GroupingSet'
import IsDistinctFrom from '../../src/nodes/IsDistinctFrom'
import IsNotDistinctFrom from '../../src/nodes/IsNotDistinctFrom'
import Limit from '../../src/nodes/Limit'
import Lock from '../../src/nodes/Lock'
import Matches from '../../src/nodes/Matches'
import NotRegexp from '../../src/nodes/NotRegexp'
import Regexp from '../../src/nodes/Regexp'
import RollUp from '../../src/nodes/RollUp'
import SQLLiteral from '../../src/nodes/SQLLiteral'
import SelectCore from '../../src/nodes/SelectCore'
import SelectStatement from '../../src/nodes/SelectStatement'
import buildQuoted from '../../src/nodes/buildQuoted'

import PostgreSQL from '../../src/visitors/PostgreSQL'
import Visitable from '../../src/visitors/Visitable'
import Visitor from '../../src/visitors/Visitor'

import SequelAST from '../../src/SequelAST'
import Table from '../../src/Table'

const scope: {
  attribute: Attribute
  table: Table
  visitor: Visitor
} = {
  attribute: new Attribute(new Table(''), ''),
  table: new Table(''),
  visitor: new (class extends Visitor {})(),
}

function compile(node: Visitable): string {
  return scope.visitor.accept(node, new SQLString()).value
}

describe('PostgreSQL Visitor', () => {
  beforeEach(() => {
    if (SequelAST.engine) {
      scope.visitor = new PostgreSQL(SequelAST.engine.connection)
      scope.table = new Table('users')
      scope.attribute = scope.table.get('id')
    }
  })

  describe('locking', () => {
    test('defaults to FOR UPDATE', () => {
      const node = new Lock(new SQLLiteral('FOR UPDATE'))

      expect(compile(node)).toStrictEqual(`FOR UPDATE`)
    })

    test('allows a custom string to be used as a lock', () => {
      const node = new Lock(new SQLLiteral('FOR SHARE'))

      expect(compile(node)).toStrictEqual(`FOR SHARE`)
    })
  })

  test('should escape LIMIT', () => {
    const stmt = new SelectStatement()
    stmt.limit = new Limit(buildQuoted('omg'))
    stmt.cores[0].projections.push(new SQLLiteral('DISTINCT ON'))
    stmt.orders.push(new SQLLiteral('xyz'))

    const sql = compile(stmt)

    expect(sql).toMatch(`LIMIT 'omg'`)
    expect(sql.match(/LIMIT/g)).toHaveLength(1)
  })

  test('should support DISTINCT ON', () => {
    const core = new SelectCore()
    core.setQuantifier = new DistinctOn(new SQLLiteral('aaron'))

    expect(compile(core)).toMatch(`DISTINCT ON ( aaron )`)
  })

  test('should support DISTINCT', () => {
    const core = new SelectCore()
    core.setQuantifier = new Distinct()

    expect(compile(core)).toStrictEqual('SELECT DISTINCT')
  })

  test('encloses LATERAL queries in parens', () => {
    const subquery = scope.table
      .project('id')
      .where(scope.table.get('name').matches('foo%'))

    expect(compile(subquery.lateral())).toStrictEqual(
      `LATERAL (SELECT id FROM "users" WHERE "users"."name" ILIKE 'foo%')`,
    )
  })

  test('produces LATERAL queries with alias', () => {
    const subquery = scope.table
      .project('id')
      .where(scope.table.get('name').matches('foo%'))

    expect(compile(subquery.lateral('bar'))).toStrictEqual(
      `LATERAL (SELECT id FROM "users" WHERE "users"."name" ILIKE 'foo%') bar`,
    )
  })

  test('should order with NULLS FIRST', () => {
    const node = scope.attribute.desc().nullsFirst()

    expect(compile(node)).toStrictEqual(`"users"."id" DESC NULLS FIRST`)
  })

  test('should order with NULLS LAST', () => {
    const node = scope.attribute.desc().nullsLast()

    expect(compile(node)).toStrictEqual(`"users"."id" DESC NULLS LAST`)
  })

  describe('Matches', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').matches('foo%')

      expect(node).toBeInstanceOf(Matches)
      expect(node.caseSensitive).toBeFalsy()
      expect(compile(node)).toStrictEqual(`"users"."name" ILIKE 'foo%'`)
    })

    test('should know how to visit case sensitive', () => {
      const node = scope.table.get('name').matches('foo%', null, true)

      expect(node.caseSensitive).toBeTruthy()
      expect(compile(node)).toStrictEqual(`"users"."name" LIKE 'foo%'`)
    })

    test('can handle ESCAPE', () => {
      const node = scope.table.get('name').matches('foo!%', '!')

      expect(compile(node)).toStrictEqual(
        `"users"."name" ILIKE 'foo!%' ESCAPE '!'`,
      )
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').matches('foo%'))

      const node = scope.attribute.inVal(subquery)
      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" ILIKE 'foo%')`,
      )
    })
  })

  describe('DoesNotMatch', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').doesNotMatch('foo%')

      expect(node).toBeInstanceOf(DoesNotMatch)
      expect(node.caseSensitive).toBeFalsy()
      expect(compile(node)).toStrictEqual(`"users"."name" NOT ILIKE 'foo%'`)
    })

    test('should know how to visit case sensitive', () => {
      const node = scope.table.get('name').doesNotMatch('foo%', null, true)

      expect(node.caseSensitive).toBeTruthy()
      expect(compile(node)).toStrictEqual(`"users"."name" NOT LIKE 'foo%'`)
    })

    test('can handle ESCAPE', () => {
      const node = scope.table.get('name').doesNotMatch('foo!%', '!')

      expect(compile(node)).toStrictEqual(
        `"users"."name" NOT ILIKE 'foo!%' ESCAPE '!'`,
      )
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').doesNotMatch('foo%'))
      const node = scope.attribute.inVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" NOT ILIKE 'foo%')`,
      )
    })
  })

  describe('Regexp', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').matchesRegexp('foo.*')

      expect(node).toBeInstanceOf(Regexp)
      expect(node.caseSensitive).toBeTruthy()
      expect(compile(node)).toStrictEqual(`"users"."name" ~ 'foo.*'`)
    })

    test('can handle case insensitive', () => {
      const node = scope.table.get('name').matchesRegexp('foo.*', false)

      expect(node).toBeInstanceOf(Regexp)
      expect(node.caseSensitive).toBeFalsy()
      expect(compile(node)).toStrictEqual(`"users"."name" ~* 'foo.*'`)
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').matchesRegexp('foo.*'))

      const node = scope.attribute.inVal(subquery)

      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" ~ 'foo.*')`,
      )
    })
  })

  describe('NotRegexp', () => {
    test('should know how to visit', () => {
      const node = scope.table.get('name').doesNotMatchRegexp('foo.*')

      expect(node).toBeInstanceOf(NotRegexp)
      expect(node.caseSensitive).toBeTruthy()
      expect(compile(node)).toStrictEqual(`"users"."name" !~ 'foo.*'`)
    })

    test('can handle case insensitive', () => {
      const node = scope.table.get('name').doesNotMatchRegexp('foo.*', false)

      expect(node.caseSensitive).toBeFalsy()
      expect(compile(node)).toStrictEqual(`"users"."name" !~* 'foo.*'`)
    })

    test('can handle subqueries', () => {
      const subquery = scope.table
        .project('id')
        .where(scope.table.get('name').doesNotMatchRegexp('foo.*'))

      const node = scope.attribute.inVal(subquery)
      expect(compile(node)).toStrictEqual(
        `"users"."id" IN (SELECT id FROM "users" WHERE "users"."name" !~ 'foo.*')`,
      )
    })
  })

  describe('BindParam', () => {
    test('increments each bind param', () => {
      const query = scope.table
        .get('name')
        .eq(new BindParam(1))
        .and(scope.table.get('id').eq(new BindParam(1)))

      expect(compile(query)).toStrictEqual(
        `"users"."name" = $1 AND "users"."id" = $2`,
      )
    })
  })

  describe('Cube', () => {
    test('should know how to visit with array arguments', () => {
      const node = new Cube([scope.table.get('name'), scope.table.get('bool')])

      expect(compile(node)).toStrictEqual(
        `CUBE( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to visit with CubeDimension Argument', () => {
      const dimensions = new GroupingElement([
        scope.table.get('name'),
        scope.table.get('bool'),
      ])

      const node = new Cube(dimensions)

      expect(compile(node)).toStrictEqual(
        `CUBE( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to generate paranthesis when supplied with many Dimensions', () => {
      const dim1 = new GroupingElement(scope.table.get('name'))
      const dim2 = new GroupingElement([
        scope.table.get('bool'),
        scope.table.get('created_at'),
      ])

      const node = new Cube([dim1, dim2])

      expect(compile(node)).toStrictEqual(
        `CUBE( ( "users"."name" ), ( "users"."bool", "users"."created_at" ) )`,
      )
    })
  })

  describe('GroupingSet', () => {
    test('should know how to visit with array arguments', () => {
      const node = new GroupingSet([
        scope.table.get('name'),
        scope.table.get('bool'),
      ])

      expect(compile(node)).toStrictEqual(
        `GROUPING SETS( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to visit with CubeDimension Argument', () => {
      const group = new GroupingElement([
        scope.table.get('name'),
        scope.table.get('bool'),
      ])

      const node = new GroupingSet(group)

      expect(compile(node)).toStrictEqual(
        `GROUPING SETS( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to generate paranthesis when supplied with many Dimensions', () => {
      const group1 = new GroupingElement(scope.table.get('name'))
      const group2 = new GroupingElement([
        scope.table.get('bool'),
        scope.table.get('created_at'),
      ])

      const node = new GroupingSet([group1, group2])

      expect(compile(node)).toStrictEqual(
        `GROUPING SETS( ( "users"."name" ), ( "users"."bool", "users"."created_at" ) )`,
      )
    })
  })

  describe('RollUp', () => {
    test('should know how to visit with array arguments', () => {
      const node = new RollUp([
        scope.table.get('name'),
        scope.table.get('bool'),
      ])

      expect(compile(node)).toStrictEqual(
        `ROLLUP( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to visit with CubeDimension Argument', () => {
      const group = new GroupingElement([
        scope.table.get('name'),
        scope.table.get('bool'),
      ])

      const node = new RollUp(group)

      expect(compile(node)).toStrictEqual(
        `ROLLUP( "users"."name", "users"."bool" )`,
      )
    })

    test('should know how to generate paranthesis when supplied with many Dimensions', () => {
      const group1 = new GroupingElement(scope.table.get('name'))
      const group2 = new GroupingElement([
        scope.table.get('bool'),
        scope.table.get('created_at'),
      ])

      const node = new RollUp([group1, group2])

      expect(compile(node)).toStrictEqual(
        `ROLLUP( ( "users"."name" ), ( "users"."bool", "users"."created_at" ) )`,
      )
    })
  })

  describe('IsDistinctFrom', () => {
    test('should handle column names on both sides', () => {
      const relation = new Table('users')

      const node = relation
        .get('first_name')
        .isDistinctFrom(relation.get('last_name'))

      expect(compile(node)).toStrictEqual(
        `"users"."first_name" IS DISTINCT FROM "users"."last_name"`,
      )
    })

    test('should handle null', () => {
      const relation = new Table('users')

      const node = new IsDistinctFrom(
        relation.get('name'),
        buildQuoted(null, relation.get('active')),
      )

      expect(compile(node)).toStrictEqual(
        `"users"."name" IS DISTINCT FROM NULL`,
      )
    })
  })

  describe('IsNotDistinctFrom', () => {
    test('should construct a valid generic SQL statement', () => {
      const relation = new Table('users')

      const node = relation.get('name').isNotDistinctFrom('Aaron Patterson')

      expect(compile(node)).toStrictEqual(
        `"users"."name" IS NOT DISTINCT FROM 'Aaron Patterson'`,
      )
    })

    test('should handle column names on both sides', () => {
      const relation = new Table('users')

      const node = relation
        .get('first_name')
        .isNotDistinctFrom(relation.get('last_name'))

      expect(compile(node)).toStrictEqual(
        `"users"."first_name" IS NOT DISTINCT FROM "users"."last_name"`,
      )
    })

    test('should handle null', () => {
      const relation = new Table('users')

      const node = new IsNotDistinctFrom(
        relation.get('name'),
        buildQuoted(null, relation.get('active')),
      )

      expect(compile(node)).toStrictEqual(
        `"users"."name" IS NOT DISTINCT FROM NULL`,
      )
    })
  })
})
