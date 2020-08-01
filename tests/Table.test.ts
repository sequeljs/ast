import './helper'

import EmptyJoinError from '../src/errors/EmptyJoinError'

import InsertManager from '../src/managers/InsertManager'
import TreeManager from '../src/managers/TreeManager'

import FullOuterJoin from '../src/nodes/FullOuterJoin'
import InnerJoin from '../src/nodes/InnerJoin'
import OuterJoin from '../src/nodes/OuterJoin'
import RightOuterJoin from '../src/nodes/RightOuterJoin'
import SQLLiteral from '../src/nodes/SQLLiteral'
import StringJoin from '../src/nodes/StringJoin'

import Table from '../src/Table'
import { TableAlias } from '../src/nodes/mod'

const scope: {
  relation: Table
} = {
  relation: new Table(''),
}

describe('Table', () => {
  beforeEach(() => {
    scope.relation = new Table('users')
  })

  test('should create join nodes', () => {
    const join = scope.relation.createStringJoin('foo')

    expect(join).toBeInstanceOf(StringJoin)
    expect(join.left).toStrictEqual('foo')
  })

  test('should create join nodes', () => {
    const join = scope.relation.createJoin('foo', 'bar')

    expect(join).toBeInstanceOf(InnerJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a klass', () => {
    const join = scope.relation.createJoin('foo', 'bar', FullOuterJoin)

    expect(join).toBeInstanceOf(FullOuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a klass', () => {
    const join = scope.relation.createJoin('foo', 'bar', OuterJoin)

    expect(join).toBeInstanceOf(OuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a klass', () => {
    const join = scope.relation.createJoin('foo', 'bar', RightOuterJoin)

    expect(join).toBeInstanceOf(RightOuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should return an insert manager', () => {
    const im = scope.relation.compileInsert('VALUES(NULL)')

    expect(im).toBeInstanceOf(InsertManager)

    im.into(new Table('users'))

    expect(im.toSQL()).toStrictEqual('INSERT INTO "users" VALUES(NULL)')
  })

  describe('skip', () => {
    test('should add an offset', () => {
      const sm = scope.relation.skip(2)

      expect(sm.toSQL()).toStrictEqual(`SELECT FROM "users" OFFSET 2`)
    })
  })

  describe('having', () => {
    test('adds a having clause', () => {
      const mgr = scope.relation.having(scope.relation.get('id').eq(10))

      expect(mgr.toSQL()).toStrictEqual(
        `SELECT FROM "users" HAVING "users"."id" = 10`,
      )
    })
  })

  describe('backwards compat', () => {
    describe('join', () => {
      test('noops on null', () => {
        const mgr = scope.relation.join(null)

        expect(mgr.toSQL()).toStrictEqual(`SELECT FROM "users"`)
      })

      test('raises EmptyJoinError on empty', () => {
        expect(() => scope.relation.join('')).toThrow(EmptyJoinError)
      })

      test('takes a second argument for join type', () => {
        const right = scope.relation.alias()
        const predicate = scope.relation.get('id').eq(right.get('id'))

        const mgr = scope.relation.join(right, OuterJoin).on(predicate)

        expect(mgr.toSQL()).toStrictEqual(
          `SELECT FROM "users" LEFT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
        )
      })
    })

    describe('join', () => {
      test('creates an outer join', () => {
        const right = scope.relation.alias()
        const predicate = scope.relation.get('id').eq(right.get('id'))

        const mgr = scope.relation.outerJoin(right).on(predicate)

        expect(mgr.toSQL()).toStrictEqual(
          `SELECT FROM "users" LEFT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
        )
      })
    })
  })

  describe('group', () => {
    test('should create a group', () => {
      const manager = scope.relation.group(scope.relation.get('id'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" GROUP BY "users"."id"`,
      )
    })
  })

  describe('alias', () => {
    test('should create a node that proxies to a table', () => {
      const node = scope.relation.alias()

      expect(node.name).toStrictEqual(`users_2`)
      expect(node.get('id').relation).toStrictEqual(node)
    })
  })

  describe('new', () => {
    test('should accept a hash', () => {
      const rel = new Table('users', 'foo')

      expect(rel.tableAlias).toStrictEqual('foo')
    })

    test('ignores as if it equals name', () => {
      const rel = new Table('users', 'users')

      expect(rel.tableAlias).toBeNull()
    })

    test('ignores TableAlias if it equals name', () => {
      const rel = new Table('users', new TableAlias(null, 'users'))

      expect(rel.tableAlias).toBeNull()
    })
  })

  describe('order', () => {
    test('should take an order', () => {
      const manager = scope.relation.order('foo')

      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" ORDER BY foo`)
    })
  })

  describe('take', () => {
    test('should add a limit', () => {
      const manager = scope.relation.take(1)
      manager.project(new SQLLiteral('*'))

      expect(manager.toSQL()).toStrictEqual(`SELECT * FROM "users" LIMIT 1`)
    })
  })

  describe('project', () => {
    test('can project', () => {
      const manager = scope.relation.project(new SQLLiteral('*'))

      expect(manager.toSQL()).toStrictEqual(`SELECT * FROM "users"`)
    })

    test('takes multiple parameters', () => {
      const manager = scope.relation.project(
        new SQLLiteral('*'),
        new SQLLiteral('*'),
      )

      expect(manager.toSQL()).toStrictEqual(`SELECT *, * FROM "users"`)
    })
  })

  describe('where', () => {
    test('returns a tree manager', () => {
      const manager = scope.relation.where(scope.relation.get('id').eq(1))
      manager.project(scope.relation.get('id'))

      expect(manager).toBeInstanceOf(TreeManager)
      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" = 1`,
      )
    })
  })

  test('should have a name', () => {
    expect(scope.relation.name).toStrictEqual('users')
  })

  test('should have a table name', () => {
    expect(scope.relation.tableName).toStrictEqual('users')
  })

  describe('[]', () => {
    describe('when given a Symbol', () => {
      test('manufactures an attribute if the symbol names an attribute within the relation', () => {
        const column = scope.relation.get('id')

        expect(column.name).toStrictEqual('id')
      })
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const relation1 = new Table('users')
      relation1.tableAlias = 'zomg'

      const relation2 = new Table('users')
      relation2.tableAlias = 'zomg'

      const array = [relation1, relation2]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const relation1 = new Table('users')
      relation1.tableAlias = 'zomg'

      const relation2 = new Table('users')
      relation2.tableAlias = 'zomg2'

      const array = [relation1, relation2]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
