import '../helper'

import Attribute from '../../src/attributes/Attribute'

import And from '../../src/nodes/And'
import Ascending from '../../src/nodes/Ascending'
import Avg from '../../src/nodes/Avg'
import Between from '../../src/nodes/Between'
import BindParam from '../../src/nodes/BindParam'
import Casted from '../../src/nodes/Casted'
import Count from '../../src/nodes/Count'
import Descending from '../../src/nodes/Descending'
import DoesNotMatch from '../../src/nodes/DoesNotMatch'
import Equality from '../../src/nodes/Equality'
import GreaterThan from '../../src/nodes/GreaterThan'
import GreaterThanOrEqual from '../../src/nodes/GreaterThanOrEqual'
import Grouping from '../../src/nodes/Grouping'
import In from '../../src/nodes/In'
import LessThan from '../../src/nodes/LessThan'
import LessThanOrEqual from '../../src/nodes/LessThanOrEqual'
import Matches from '../../src/nodes/Matches'
import Max from '../../src/nodes/Max'
import Min from '../../src/nodes/Min'
import NotEqual from '../../src/nodes/NotEqual'
import NotIn from '../../src/nodes/NotIn'
import Or from '../../src/nodes/Or'
import Quoted from '../../src/nodes/Quoted'
import SQLLiteral from '../../src/nodes/SQLLiteral'
import Sum from '../../src/nodes/Sum'
import TableAlias from '../../src/nodes/TableAlias'
import buildQuoted from '../../src/nodes/buildQuoted'

import Table from '../../src/Table'

import type TypeCaster from '../../src/interfaces/TypeCaster'

import UnboundableBindParam from '../support/UnboundableBindParam'
import UnboundableQuoted from '../support/UnboundableQuoted'

function formatDateToSQL(date: Date) {
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
}

function quotedRange(beginVal: number, endVal: number, exclude: boolean) {
  return {
    begin: new Quoted(beginVal),
    end: new Quoted(endVal),
    excludeEnd: exclude,
  }
}

describe('attribute', () => {
  describe('notEq', () => {
    test('should create a NotEqual node', () => {
      const relation = new Table('users')

      expect(relation.get('id').notEq(10)).toBeInstanceOf(NotEqual)
    })

    test('should generate != in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notEq(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" != 10`,
      )
    })

    test('should handle null', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notEq(null))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" IS NOT NULL`,
      )
    })

    test('should handle an Unboundable', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notEq(new UnboundableQuoted(1)))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE 1 = 1`,
      )
    })
  })

  describe('notEqAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').notEqAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notEqAny([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" != 1 OR "users"."id" != 2)`,
      )
    })
  })

  describe('notEqAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').notEqAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notEqAll([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" != 1 AND "users"."id" != 2)`,
      )
    })
  })

  describe('gt', () => {
    test('shoulld create a GreatherThan node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gt(10)).toBeInstanceOf(GreaterThan)
    })

    test('should generate > in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gt(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" > 10`,
      )
    })

    test('should handle comparing with a subquery', () => {
      const relation = new Table('users')

      const avg = relation.project(relation.get('karma').average())
      const mgr = relation
        .project(new SQLLiteral('*'))
        .where(relation.get('karma').gt(avg))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT * FROM "users" WHERE "users"."karma" > (SELECT AVG("users"."karma") FROM "users")`,
      )
    })

    test('should accept various data types', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').gt('fake_name'))

      expect(mgr.toSQL()).toMatch(`"users"."name" > 'fake_name'`)

      const currentTime = new Date()
      mgr.where(relation.get('created_at').gt(currentTime))

      expect(mgr.toSQL()).toMatch(
        `"users"."created_at" > '${formatDateToSQL(currentTime)}'`,
      )
    })
  })

  describe('gtAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gtAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gtAny([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" > 1 OR "users"."id" > 2)`,
      )
    })
  })

  describe('gtAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gtAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gtAll([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" > 1 AND "users"."id" > 2)`,
      )
    })
  })

  describe('gteq', () => {
    test('should create a GreaterThanOrEqual node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gteq(10)).toBeInstanceOf(GreaterThanOrEqual)
    })

    test('should generate >= in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gteq(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" >= 10`,
      )
    })

    test('should accept various data types', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').gteq('fake_name'))

      expect(mgr.toSQL()).toMatch(`"users"."name" >= 'fake_name'`)

      const currentTime = new Date()
      mgr.where(relation.get('created_at').gteq(currentTime))

      expect(mgr.toSQL()).toMatch(
        `"users"."created_at" >= '${formatDateToSQL(currentTime)}'`,
      )
    })
  })

  describe('gteqAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gteqAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gteqAny([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" >= 1 OR "users"."id" >= 2)`,
      )
    })
  })

  describe('gteqAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').gteqAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').gteqAll([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" >= 1 AND "users"."id" >= 2)`,
      )
    })
  })

  describe('lt', () => {
    test('should create a LessThan node', () => {
      const relation = new Table('users')

      expect(relation.get('id').lt(10)).toBeInstanceOf(LessThan)
    })

    test('should generate < in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').lt(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" < 10`,
      )
    })

    test('should accept various data types.', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').lt('fake_name'))
      expect(mgr.toSQL()).toMatch(`"users"."name" < 'fake_name'`)

      const currentTime = new Date()
      mgr.where(relation.get('created_at').lt(currentTime))
      expect(mgr.toSQL()).toMatch(
        `"users"."created_at" < '${formatDateToSQL(currentTime)}'`,
      )
    })
  })

  describe('ltAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').ltAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').ltAny([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" < 1 OR "users"."id" < 2)`,
      )
    })
  })

  describe('ltAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').ltAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').ltAll([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" < 1 AND "users"."id" < 2)`,
      )
    })
  })

  describe('lteq', () => {
    test('should create a LessThanOrEqual node', () => {
      const relation = new Table('users')

      expect(relation.get('id').lteq(10)).toBeInstanceOf(LessThanOrEqual)
    })

    test('should generate <= in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').lteq(10))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" <= 10`,
      )
    })

    test('should accept various data types.', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').lteq('fake_name'))
      expect(mgr.toSQL()).toMatch(`"users"."name" <= 'fake_name'`)

      const currentTime = new Date()
      mgr.where(relation.get('created_at').lteq(currentTime))
      expect(mgr.toSQL()).toMatch(
        `"users"."created_at" <= '${formatDateToSQL(currentTime)}'`,
      )
    })
  })

  describe('lteqAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').lteqAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').lteqAny([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" <= 1 OR "users"."id" <= 2)`,
      )
    })
  })

  describe('lteqAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').lteqAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').lteqAll([1, 2]))
      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" <= 1 AND "users"."id" <= 2)`,
      )
    })
  })

  describe('average', () => {
    test('should create an Avg node', () => {
      const relation = new Table('users')

      expect(relation.get('id').average()).toBeInstanceOf(Avg)
    })

    test('should generate the proper SQL', () => {
      const relation = new Table('users')
      const mgr = relation.project(relation.get('id').average())

      expect(mgr.toSQL()).toStrictEqual(`SELECT AVG("users"."id") FROM "users"`)
    })
  })

  describe('maximum', () => {
    test('should create a Max node', () => {
      const relation = new Table('users')

      expect(relation.get('id').maximum()).toBeInstanceOf(Max)
    })

    test('should generate proper SQL', () => {
      const relation = new Table('users')
      const mgr = relation.project(relation.get('id').maximum())

      expect(mgr.toSQL()).toStrictEqual(`SELECT MAX("users"."id") FROM "users"`)
    })
  })

  describe('minimum', () => {
    test('should create a Min node', () => {
      const relation = new Table('users')

      expect(relation.get('id').minimum()).toBeInstanceOf(Min)
    })

    test('should generate proper SQL', () => {
      const relation = new Table('users')
      const mgr = relation.project(relation.get('id').minimum())

      expect(mgr.toSQL()).toStrictEqual(`SELECT MIN("users"."id") FROM "users"`)
    })
  })

  describe('sum', () => {
    test('should create a Sum node', () => {
      const relation = new Table('users')

      expect(relation.get('id').sum()).toBeInstanceOf(Sum)
    })

    test('should generate the proper SQL', () => {
      const relation = new Table('users')
      const mgr = relation.project(relation.get('id').sum())

      expect(mgr.toSQL()).toStrictEqual(`SELECT SUM("users"."id") FROM "users"`)
    })
  })

  describe('count', () => {
    test('should return a Count node', () => {
      const relation = new Table('users')

      expect(relation.get('id').count()).toBeInstanceOf(Count)
    })

    test('should take a distinct param', () => {
      const relation = new Table('users')

      const count = relation.get('id').count(true)

      expect(count).toBeInstanceOf(Count)
      expect(count.distinct).toBeTruthy()
    })
  })

  describe('eq', () => {
    test('should return an Equality node', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const equality = attribute.eq(1)

      expect(equality.left).toStrictEqual(attribute)
      expect(equality.right).toStrictEqual(buildQuoted(1, attribute))
      expect(equality).toBeInstanceOf(Equality)
    })

    test('should generate = in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eq(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" = 10`,
      )
    })

    test('should handle null', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eq(null))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" IS NULL`,
      )
    })

    test('should handle an Unboundable', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eq(new UnboundableQuoted(1)))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE 1 = 0`,
      )
    })
  })

  describe('eqAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').eqAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eqAny([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" = 1 OR "users"."id" = 2)`,
      )
    })

    test('should not eat input', () => {
      const relation = new Table('users')

      const values = [1, 2]

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eqAny(values))

      expect(values).toStrictEqual([1, 2])
    })
  })

  describe('eqAll', () => {
    test('shoud create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').eqAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eqAll([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" = 1 AND "users"."id" = 2)`,
      )
    })

    test('should not eat input', () => {
      const relation = new Table('users')

      const values = [1, 2]

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eqAll(values))

      expect(values).toStrictEqual([1, 2])
    })
  })

  describe('matches', () => {
    test('should create a Matches node', () => {
      const relation = new Table('users')

      expect(relation.get('name').matches('%bacon%')).toBeInstanceOf(Matches)
    })

    test('should generate LIKE in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').matches('%bacon%'))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."name" LIKE '%bacon%'`,
      )
    })
  })

  describe('matchesAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(
        relation.get('name').matchesAny(['%chunky%', '%bacon%']),
      ).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').matchesAny(['%chunky%', '%bacon%']))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."name" LIKE '%chunky%' OR "users"."name" LIKE '%bacon%')`,
      )
    })
  })

  describe('matchesAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(
        relation.get('name').matchesAll(['%chunky%', '%bacon%']),
      ).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').matchesAll(['%chunky%', '%bacon%']))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."name" LIKE '%chunky%' AND "users"."name" LIKE '%bacon%')`,
      )
    })
  })

  describe('doesNotMatch', () => {
    test('should create a DoesNotMatch node', () => {
      const relation = new Table('users')

      expect(relation.get('name').doesNotMatch('%bacon%')).toBeInstanceOf(
        DoesNotMatch,
      )
    })

    test('should generate NOT LIKE in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').doesNotMatch('%bacon%'))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."name" NOT LIKE '%bacon%'`,
      )
    })
  })

  describe('doesNotMatchAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(
        relation.get('name').doesNotMatchAny(['%chunky%', '%bacon%']),
      ).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').doesNotMatchAny(['%chunky%', '%bacon%']))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."name" NOT LIKE '%chunky%' OR "users"."name" NOT LIKE '%bacon%')`,
      )
    })
  })

  describe('doesNotMatchAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(
        relation.get('name').doesNotMatchAll(['%chunky%', '%bacon%']),
      ).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').doesNotMatchAll(['%chunky%', '%bacon%']))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."name" NOT LIKE '%chunky%' AND "users"."name" NOT LIKE '%bacon%')`,
      )
    })
  })

  describe('between', () => {
    test('can be constructed with a standard range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(1, 3)

      expect(node).toStrictEqual(
        new Between(
          attribute,
          new And([new Casted(1, attribute), new Casted(3, attribute)]),
        ),
      )
    })

    test('can be constructed with a range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(-Infinity, 3)

      expect(node).toStrictEqual(
        new LessThanOrEqual(attribute, new Casted(3, attribute)),
      )
    })

    test('can be constructed with a quoted range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, 3, false)

      const node = attribute.between(range.begin, range.end, !range.excludeEnd)

      expect(node).toStrictEqual(new LessThanOrEqual(attribute, new Quoted(3)))
    })

    test('can be constructed with an exclusive range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(-Infinity, 3, false)

      expect(node).toStrictEqual(
        new LessThan(attribute, new Casted(3, attribute)),
      )
    })

    test('can be constructed with a quoted exclusive range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, 3, true)

      const node = attribute.between(range.begin, range.end, !range.excludeEnd)

      expect(node).toStrictEqual(new LessThan(attribute, new Quoted(3)))
    })

    test('can be constructed with an infinite range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(-Infinity, Infinity)

      expect(node).toStrictEqual(new NotIn(attribute, []))
    })

    test('can be constructed with a quoted infinite range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, Infinity, false)

      const node = attribute.between(range.begin, range.end, !range.excludeEnd)

      expect(node).toStrictEqual(new NotIn(attribute, []))
    })

    test('can be constructed with a range ending at Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(0, Infinity)

      expect(node).toStrictEqual(
        new GreaterThanOrEqual(attribute, new Casted(0, attribute)),
      )
    })

    test('can be constructed with a quoted range ending at Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(0, Infinity, false)

      const node = attribute.between(range.begin, range.end, !range.excludeEnd)

      expect(node).toStrictEqual(
        new GreaterThanOrEqual(attribute, new Quoted(0)),
      )
    })

    test('can be constructed with an exclusive range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(0, 3, false)

      expect(node).toStrictEqual(
        new And([
          new GreaterThanOrEqual(attribute, new Casted(0, attribute)),
          new LessThan(attribute, new Casted(3, attribute)),
        ]),
      )
    })

    test('can be constructed with an unboundable range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(
        new UnboundableQuoted(0),
        new UnboundableQuoted(3),
      )

      expect(node).toStrictEqual(new In(attribute, []))
    })

    test('can be constructed with a BindParam Infinity range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(
        new BindParam(Infinity),
        new BindParam(-Infinity),
      )

      expect(node).toStrictEqual(new NotIn(attribute, []))
    })

    test('can be constructed with a Unboundable BindParam range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.between(
        new UnboundableBindParam(new UnboundableQuoted(0)),
        new UnboundableBindParam(new UnboundableQuoted(3)),
      )

      expect(node).toStrictEqual(new In(attribute, []))
    })
  })

  describe('in', () => {
    test('can be constructed with a subquery', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').doesNotMatchAll(['%chunky%', '%bacon%']))

      const attribute = new Attribute(relation, 'id')

      const node = attribute.inVal(mgr)

      expect(node).toStrictEqual(new In(attribute, mgr.ast))
    })

    test('can be constructed with a list', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.inVal([1, 2, 3])

      expect(node).toStrictEqual(
        new In(attribute, [
          new Casted(1, attribute),
          new Casted(2, attribute),
          new Casted(3, attribute),
        ]),
      )
    })

    test('can be constructed with a random object', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const randomObject = {}

      const node = attribute.inVal(randomObject)

      expect(node).toStrictEqual(
        new In(attribute, new Casted(randomObject, attribute)),
      )
    })

    test('should generate IN in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').inVal([1, 2, 3]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" IN (1, 2, 3)`,
      )
    })
  })

  describe('inAny', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').inAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(
        relation.get('id').inAny([
          [1, 2],
          [3, 4],
        ]),
      )

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" IN (1, 2) OR "users"."id" IN (3, 4))`,
      )
    })
  })

  describe('inAll', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').inAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(
        relation.get('id').inAll([
          [1, 2],
          [3, 4],
        ]),
      )

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" IN (1, 2) AND "users"."id" IN (3, 4))`,
      )
    })
  })

  describe('notBetween', () => {
    test('can be constructed with a standard range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(1, 3)

      expect(node).toStrictEqual(
        new Grouping(
          new Or(
            new LessThan(attribute, new Casted(1, attribute)),
            new GreaterThan(attribute, new Casted(3, attribute)),
          ),
        ),
      )
    })

    test('can be constructed with a range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(-Infinity, 3)

      expect(node).toStrictEqual(
        new GreaterThan(attribute, new Casted(3, attribute)),
      )
    })

    test('can be constructed with a quoted range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, 3, false)

      const node = attribute.notBetween(
        range.begin,
        range.end,
        !range.excludeEnd,
      )

      expect(node).toStrictEqual(new GreaterThan(attribute, new Quoted(3)))
    })

    test('can be constructed with an exclusive range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(-Infinity, 3, false)

      expect(node).toStrictEqual(
        new GreaterThanOrEqual(attribute, new Casted(3, attribute)),
      )
    })

    test('can be constructed with a quoted exclusive range starting from -Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, 3, true)

      const node = attribute.notBetween(
        range.begin,
        range.end,
        !range.excludeEnd,
      )

      expect(node).toStrictEqual(
        new GreaterThanOrEqual(attribute, new Quoted(3)),
      )
    })

    test('can be constructed with an infinite range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(-Infinity, Infinity)

      expect(node).toStrictEqual(new In(attribute, []))
    })

    test('can be constructed with a quoted infinite range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(-Infinity, Infinity, false)

      const node = attribute.notBetween(
        range.begin,
        range.end,
        !range.excludeEnd,
      )

      expect(node).toStrictEqual(new In(attribute, []))
    })

    test('can be constructed with a range ending at Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(0, Infinity)

      expect(node).toStrictEqual(
        new LessThan(attribute, new Casted(0, attribute)),
      )
    })

    test('can be constructed with a quoted range ending at Infinity', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const range = quotedRange(0, Infinity, false)

      const node = attribute.notBetween(
        range.begin,
        range.end,
        !range.excludeEnd,
      )

      expect(node).toStrictEqual(new LessThan(attribute, new Quoted(0)))
    })

    test('can be constructed with an exclusive range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(0, 3, false)

      expect(node).toStrictEqual(
        new Grouping(
          new Or(
            new LessThan(attribute, new Casted(0, attribute)),
            new GreaterThanOrEqual(attribute, new Casted(3, attribute)),
          ),
        ),
      )
    })

    test('can be constructed with an unboundable range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(
        new UnboundableQuoted(0),
        new UnboundableQuoted(3),
      )

      expect(node).toStrictEqual(new NotIn(attribute, []))
    })

    test('can be constructed with a BindParam Infinity range', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notBetween(
        new BindParam(Infinity),
        new BindParam(-Infinity),
      )

      expect(node).toStrictEqual(new In(attribute, []))
    })
  })

  describe('notIn', () => {
    test('can be constructed with a subquery', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('name').doesNotMatchAll(['%chunky%', '%bacon%']))

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notInVal(mgr)

      expect(node).toStrictEqual(new NotIn(attribute, mgr.ast))
    })

    test('can be constructed with a Union', () => {
      const relation = new Table('users')

      const mgr1 = relation.project(relation.get('id'))
      const mgr2 = relation.project(relation.get('id'))

      const union = mgr1.union(mgr2)

      const node = relation.get('id').inVal(union)

      expect(node.toSQL()).toMatch(
        `"users"."id" IN (( SELECT "users"."id" FROM "users" UNION SELECT "users"."id" FROM "users" ))`,
      )
    })

    test('can be constructed with a list', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const node = attribute.notInVal([1, 2, 3])

      expect(node).toStrictEqual(
        new NotIn(attribute, [
          new Casted(1, attribute),
          new Casted(2, attribute),
          new Casted(3, attribute),
        ]),
      )
    })

    test('can be constructed with a random object', () => {
      const relation = new Table('users')

      const attribute = new Attribute(relation, 'id')

      const randomObject = {}

      const node = attribute.notInVal(randomObject)

      expect(node).toStrictEqual(
        new NotIn(attribute, new Casted(randomObject, attribute)),
      )
    })

    test('should generate NOT IN in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').notInVal([1, 2, 3]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" NOT IN (1, 2, 3)`,
      )
    })
  })

  describe('not_in_any', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').notInAny([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ORs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(
        relation.get('id').notInAny([
          [1, 2],
          [3, 4],
        ]),
      )

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" NOT IN (1, 2) OR "users"."id" NOT IN (3, 4))`,
      )
    })
  })

  describe('not_in_all', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').notInAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(
        relation.get('id').notInAll([
          [1, 2],
          [3, 4],
        ]),
      )

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" NOT IN (1, 2) AND "users"."id" NOT IN (3, 4))`,
      )
    })
  })

  describe('eq_all', () => {
    test('should create a Grouping node', () => {
      const relation = new Table('users')

      expect(relation.get('id').eqAll([1, 2])).toBeInstanceOf(Grouping)
    })

    test('should generate ANDs in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.where(relation.get('id').eqAll([1, 2]))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE ("users"."id" = 1 AND "users"."id" = 2)`,
      )
    })
  })

  describe('asc', () => {
    test('should create an Ascending node', () => {
      const relation = new Table('users')

      expect(relation.get('id').asc()).toBeInstanceOf(Ascending)
    })

    test('should generate ASC in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.order(relation.get('id').asc())

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" ORDER BY "users"."id" ASC`,
      )
    })
  })

  describe('desc', () => {
    test('should create a Descending node', () => {
      const relation = new Table('users')

      expect(relation.get('id').desc()).toBeInstanceOf(Descending)
    })

    test('should generate DESC in SQL', () => {
      const relation = new Table('users')

      const mgr = relation.project(relation.get('id'))
      mgr.order(relation.get('id').desc())

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" ORDER BY "users"."id" DESC`,
      )
    })
  })
})

describe('equality', () => {
  describe('to_sql', () => {
    test('should produce sql', () => {
      const relation = new Table('users')

      const condition = relation.get('id').eq(1)

      expect(condition.toSQL()).toStrictEqual(`"users"."id" = 1`)
    })
  })
})

describe('type casting', () => {
  test('does not type cast by default', () => {
    const relation = new Table('foo')

    const condition = relation.get('id').eq('1')

    expect(relation.isAbleToTypeCast()).toBeFalsy()

    expect(condition.toSQL()).toStrictEqual(`"foo"."id" = '1'`)
  })

  test('type casts when given an explicit caster', () => {
    const fakeCaster: TypeCaster = {
      isAbleToTypeCast(): boolean {
        return true
      },
      typeCastForDatabase(
        attributeName: string,
        value: number | string,
      ): number | string {
        if (attributeName === 'id') {
          return parseInt(String(value), 10)
        }

        return String(value)
      },
    }

    const relation = new Table('foo', null, fakeCaster)

    const condition = relation
      .get('id')
      .eq('1')
      .and(relation.get('other_id').eq('2'))

    expect(relation.isAbleToTypeCast()).toBeTruthy()

    expect(condition.toSQL()).toStrictEqual(
      `"foo"."id" = 1 AND "foo"."other_id" = '2'`,
    )
  })

  test('type casts when using a TableAlias', () => {
    const fakeCaster: TypeCaster = {
      isAbleToTypeCast(): boolean {
        return true
      },
      typeCastForDatabase(
        attributeName: string,
        value: number | string,
      ): number | string {
        if (attributeName === 'id') {
          return parseInt(String(value), 10)
        }

        return String(value)
      },
    }

    const relation = new Table('foo', null, fakeCaster)
    const aliaz = new TableAlias(relation, 'bar')

    const condition = aliaz.get('id').eq('1').and(aliaz.get('other_id').eq('2'))

    expect(aliaz.isAbleToTypeCast()).toBeTruthy()

    expect(condition.toSQL()).toStrictEqual(
      `"bar"."id" = 1 AND "bar"."other_id" = '2'`,
    )
  })

  test('does not type cast SQLLiteral nodes', () => {
    const fakeCaster: TypeCaster = {
      isAbleToTypeCast(): boolean {
        return true
      },
      typeCastForDatabase(_: string, value: number | string): number | string {
        return parseInt(String(value), 10)
      },
    }

    const relation = new Table('foo', null, fakeCaster)

    const condition = relation.get('id').eq(new SQLLiteral('(select 1)'))

    expect(relation.isAbleToTypeCast()).toBeTruthy()

    expect(condition.toSQL()).toStrictEqual(`"foo"."id" = (select 1)`)
  })
})
