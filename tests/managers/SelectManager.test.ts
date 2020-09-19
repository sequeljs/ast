import '../helper.js'

import Attribute from '../../src/attributes/Attribute.js'

import EmptyJoinError from '../../src/errors/EmptyJoinError.js'
import EngineNotSetError from '../../src/errors/EngineNotSetError.js'
import VisitorError from '../../src/errors/VisitorError.js'
import VisitorNotSetError from '../../src/errors/VisitorNotSetError.js'

import Engine from '../../src/interfaces/Engine.js'

import InsertManager from '../../src/managers/InsertManager.js'
import SelectManager from '../../src/managers/SelectManager.js'

import And from '../../src/nodes/And.js'
import As from '../../src/nodes/As.js'
import Ascending from '../../src/nodes/Ascending.js'
import Between from '../../src/nodes/Between.js'
import CurrentRow from '../../src/nodes/CurrentRow.js'
import Distinct from '../../src/nodes/Distinct.js'
import DistinctOn from '../../src/nodes/DistinctOn.js'
import Following from '../../src/nodes/Following.js'
import FullOuterJoin from '../../src/nodes/FullOuterJoin.js'
import Grouping from '../../src/nodes/Grouping.js'
import InnerJoin from '../../src/nodes/InnerJoin.js'
import OuterJoin from '../../src/nodes/OuterJoin.js'
import Preceding from '../../src/nodes/Preceding.js'
import RightOuterJoin from '../../src/nodes/RightOuterJoin.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'
import StringJoin from '../../src/nodes/StringJoin.js'
import buildQuoted from '../../src/nodes/buildQuoted.js'

import PostgreSQL from '../../src/visitors/PostgreSQL.js'

import SequelAST from '../../src/SequelAST.js'
import Table from '../../src/Table.js'

import FakeRecord from '../support/FakeRecord.js'
import { Union } from '../../src/nodes/mod.js'

const scope: {
  engine: Engine
  manager1: SelectManager
  manager2: SelectManager
} = {
  engine: new FakeRecord(),
  manager1: new SelectManager(),
  manager2: new SelectManager(),
}

describe('SelectManager', () => {
  beforeEach(() => {
    scope.engine = new FakeRecord()
  })

  test('join sources', () => {
    const manager = new SelectManager()
    manager.joinSources.push(new StringJoin(buildQuoted('foo')))

    expect(manager.toSQL()).toStrictEqual(`SELECT FROM 'foo'`)
  })

  describe('backwards compatibility', () => {
    describe('project', () => {
      test('accepts strings as sql literals', () => {
        const table = new Table('users')

        const manager = new SelectManager()
        manager.project('id')
        manager.from(table)

        expect(manager.toSQL()).toStrictEqual(`SELECT id FROM "users"`)
      })
    })

    describe('order', () => {
      test('accepts strings', () => {
        const table = new Table('users')

        const manager = new SelectManager()
        manager.project(new SQLLiteral('*'))
        manager.from(table)
        manager.order('foo')

        expect(manager.toSQL()).toStrictEqual(
          `SELECT * FROM "users" ORDER BY foo`,
        )
      })
    })

    describe('group', () => {
      test('takes a symbol', () => {
        const table = new Table('users')

        const manager = new SelectManager()
        manager.from(table)
        manager.group('foo')

        expect(manager.toSQL()).toStrictEqual(
          `SELECT FROM "users" GROUP BY foo`,
        )
      })
    })

    describe('as', () => {
      test('makes an AS node by grouping the AST', () => {
        const manager = new SelectManager()

        const as = manager.as(new SQLLiteral('foo'))

        expect(as.left).toBeInstanceOf(Grouping)
        expect(as.left.expr).toStrictEqual(manager.ast)
        expect(as.right).toStrictEqual(new SQLLiteral('foo'))
      })

      test('converts right to SQLLiteral if a string', () => {
        const manager = new SelectManager()

        const as = manager.as('foo')

        expect(as.right).toBeInstanceOf(SQLLiteral)
      })

      test('can make a subselect', () => {
        const manager = new SelectManager()
        manager.project(new SQLLiteral('*'))
        manager.from(new SQLLiteral('zomg'))

        const as = manager.as(new SQLLiteral('foo'))

        const manager2 = new SelectManager()
        manager2.project(new SQLLiteral('name'))
        manager2.from(as)

        expect(manager2.toSQL()).toStrictEqual(
          `SELECT name FROM (SELECT * FROM zomg) foo`,
        )
      })
    })

    describe('from', () => {
      test('ignores strings when table of same name exists', () => {
        const table = new Table('users')

        const manager = new SelectManager()
        manager.from(table)
        manager.from('users')
        manager.project(table.get('id'))

        expect(manager.toSQL()).toStrictEqual(`SELECT "users"."id" FROM users`)
      })

      test('should support any ast', () => {
        const table = new Table('users')

        const manager1 = new SelectManager()
        manager1.project(new SQLLiteral('*'))
        manager1.from(table)

        const as = manager1.as(new SQLLiteral('omg'))

        const manager2 = new SelectManager()
        manager2.project(new SQLLiteral('lol'))
        manager2.from(as)

        expect(manager2.toSQL()).toStrictEqual(
          `SELECT lol FROM (SELECT * FROM "users") omg`,
        )
      })

      test('should throw with null engine', () => {
        const manager1 = new SelectManager()

        expect(() => manager1.toSQL(null)).toThrow(VisitorError)
      })
    })

    describe('having', () => {
      test('converts strings to SQLLiteral', () => {
        const table = new Table('users')

        const manager = table.from()
        manager.having(new SQLLiteral('foo'))

        expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" HAVING foo`)
      })

      test('can have multiple items specified separately', () => {
        const table = new Table('users')

        const manager = table.from()
        manager.having(new SQLLiteral('foo'))
        manager.having(new SQLLiteral('bar'))

        expect(manager.toSQL()).toStrictEqual(
          `SELECT FROM "users" HAVING foo AND bar`,
        )
      })

      test('can receive any node', () => {
        const table = new Table('users')

        const manager = table.from()
        manager.having(new And([new SQLLiteral('foo'), new SQLLiteral('bar')]))

        expect(manager.toSQL()).toStrictEqual(
          `SELECT FROM "users" HAVING foo AND bar`,
        )
      })
    })

    describe('on', () => {
      test('converts to SQLLiteral', () => {
        const table = new Table('users')

        const right = table.alias()

        const manager = table.from()
        manager.join(right).on('omg')

        expect(manager.toSQL()).toStrictEqual(
          `SELECT FROM "users" INNER JOIN "users" "users_2" ON omg`,
        )
      })

      test('converts to SQLLiteral with multiple items', () => {
        const table = new Table('users')

        const right = table.alias()

        const manager = table.from()
        manager.join(right).on('omg', '123')

        expect(manager.toSQL()).toStrictEqual(
          `SELECT FROM "users" INNER JOIN "users" "users_2" ON omg AND 123`,
        )
      })
    })
  })

  describe('initialize', () => {
    test('uses alias in sql', () => {
      const table = new Table('users', 'foo')

      const manager = table.from()
      manager.skip(10)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" "foo" OFFSET 10`,
      )
    })
  })

  describe('skip', () => {
    test('should add an offset', () => {
      const table = new Table('users')

      const manager = table.from()
      manager.skip(10)

      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" OFFSET 10`)
    })

    test('should chain', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.skip(10).toSQL()).toStrictEqual(
        `SELECT FROM "users" OFFSET 10`,
      )
    })
  })

  describe('offset', () => {
    test('should add an offset', () => {
      const table = new Table('users')

      const manager = table.from()
      manager.offset = 10
      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" OFFSET 10`)
    })

    test('should remove an offset', () => {
      const table = new Table('users')

      const manager = table.from()
      manager.offset = 10
      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" OFFSET 10`)

      manager.offset = null
      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users"`)
    })

    test('should return the offset', () => {
      const table = new Table('users')

      const manager = table.from()
      manager.offset = 10

      expect(manager.offset).toStrictEqual(10)
    })
  })

  describe('exists', () => {
    test('should create an exists clause', () => {
      const table = new Table('users')

      const manager = new SelectManager(table)
      manager.project(new SQLLiteral('*'))

      const manager2 = new SelectManager()
      manager2.project(manager.exists())

      expect(manager2.toSQL()).toStrictEqual(
        `SELECT EXISTS (${manager.toSQL()})`,
      )
    })

    test('can be aliased', () => {
      const table = new Table('users')

      const manager = new SelectManager(table)
      manager.project(new SQLLiteral('*'))

      const manager2 = new SelectManager()
      manager2.project(manager.exists().as('foo'))

      expect(manager2.toSQL()).toStrictEqual(
        `SELECT EXISTS (${manager.toSQL()}) AS foo`,
      )
    })
  })

  describe('union', () => {
    beforeEach(() => {
      const table = new Table('users')

      scope.manager1 = new SelectManager(table)
      scope.manager1.project(new SQLLiteral('*'))
      scope.manager1.where(table.get('age').lt(18))

      scope.manager2 = new SelectManager(table)
      scope.manager2.project(new SQLLiteral('*'))
      scope.manager2.where(table.get('age').gt(99))
    })

    test('should union two managers', () => {
      const node = scope.manager1.union(scope.manager2)

      expect(node.toSQL()).toStrictEqual(
        `( SELECT * FROM "users" WHERE "users"."age" < 18 UNION SELECT * FROM "users" WHERE "users"."age" > 99 )`,
      )
    })

    test('should handle nested', () => {
      const node = new Union(
        new Union(scope.manager1, scope.manager2),
        new Union(scope.manager1, scope.manager2),
      )

      expect(node.toSQL()).toStrictEqual(
        `( (SELECT * FROM "users" WHERE "users"."age" < 18) UNION (SELECT * FROM "users" WHERE "users"."age" > 99) UNION (SELECT * FROM "users" WHERE "users"."age" < 18) UNION (SELECT * FROM "users" WHERE "users"."age" > 99) )`,
      )
    })

    test('should union all', () => {
      const node = scope.manager1.unionAll(scope.manager2)

      expect(node.toSQL()).toStrictEqual(
        `( SELECT * FROM "users" WHERE "users"."age" < 18 UNION ALL SELECT * FROM "users" WHERE "users"."age" > 99 )`,
      )
    })
  })

  describe('intersect', () => {
    beforeEach(() => {
      const table = new Table('users')
      scope.manager1 = new SelectManager(table)
      scope.manager1.project(new SQLLiteral('*'))
      scope.manager1.where(table.get('age').gt(18))

      scope.manager2 = new SelectManager(table)
      scope.manager2.project(new SQLLiteral('*'))
      scope.manager2.where(table.get('age').lt(99))
    })

    test('should interect two managers', () => {
      const node = scope.manager1.intersect(scope.manager2)

      expect(node.toSQL()).toStrictEqual(
        `( SELECT * FROM "users" WHERE "users"."age" > 18 INTERSECT SELECT * FROM "users" WHERE "users"."age" < 99 )`,
      )
    })
  })

  describe('except', () => {
    beforeEach(() => {
      const table = new Table('users')

      scope.manager1 = new SelectManager(table)
      scope.manager1.project(new SQLLiteral('*'))
      scope.manager1.where(table.get('age').between(18, 60))

      scope.manager2 = new SelectManager(table)
      scope.manager2.project(new SQLLiteral('*'))
      scope.manager2.where(table.get('age').between(40, 99))
    })

    test('should except two managers', () => {
      const node = scope.manager1.except(scope.manager2)

      expect(node.toSQL()).toStrictEqual(
        `( SELECT * FROM "users" WHERE "users"."age" BETWEEN 18 AND 60 EXCEPT SELECT * FROM "users" WHERE "users"."age" BETWEEN 40 AND 99 )`,
      )
    })

    test('should handle minus', () => {
      const node = scope.manager1.minus(scope.manager2)

      expect(node.toSQL()).toStrictEqual(
        `( SELECT * FROM "users" WHERE "users"."age" BETWEEN 18 AND 60 EXCEPT SELECT * FROM "users" WHERE "users"."age" BETWEEN 40 AND 99 )`,
      )
    })
  })

  describe('with', () => {
    test('should support basic WITH', () => {
      const users = new Table('users')
      const usersTop = new Table('users_top')
      const comments = new Table('comments')

      const top = users
        .project(users.get('id'))
        .where(users.get('karma').gt(100))
      const usersAs = new As(usersTop, top)
      const selectManager = comments
        .project(new SQLLiteral('*'))
        .with(usersAs)
        .where(
          comments.get('author_id').inVal(usersTop.project(usersTop.get('id'))),
        )

      expect(selectManager.toSQL()).toStrictEqual(
        `WITH "users_top" AS (SELECT "users"."id" FROM "users" WHERE "users"."karma" > 100) SELECT * FROM "comments" WHERE "comments"."author_id" IN (SELECT "users_top"."id" FROM "users_top")`,
      )
    })

    test('should support WITH RECURSIVE', () => {
      const comments = new Table('comments')
      const commentsId = comments.get('id')
      const commentsParentId = comments.get('parent_id')

      const replies = new Table('replies')
      const repliesId = replies.get('id')

      const recursiveTerm = new SelectManager()
      recursiveTerm
        .from(comments)
        .project(commentsId, commentsParentId)
        .where(commentsId.eq(42))

      const nonRecursiveTerm = new SelectManager()
      nonRecursiveTerm
        .from(comments)
        .project(commentsId, commentsParentId)
        .join(replies)
        .on(commentsParentId.eq(repliesId))

      const union = recursiveTerm.union(nonRecursiveTerm)

      const asStatement = new As(replies, union)

      const manager = new SelectManager()
      manager
        .withRecursive(asStatement)
        .from(replies)
        .project(new SQLLiteral('*'))

      expect(manager.toSQL()).toStrictEqual(
        `WITH RECURSIVE "replies" AS ( SELECT "comments"."id", "comments"."parent_id" FROM "comments" WHERE "comments"."id" = 42 UNION SELECT "comments"."id", "comments"."parent_id" FROM "comments" INNER JOIN "replies" ON "comments"."parent_id" = "replies"."id" ) SELECT * FROM "replies"`,
      )
    })
  })

  describe('ast', () => {
    test('should return the ast', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.ast).toBeTruthy()
    })

    test('should allow orders to work when the ast is grepped', () => {
      const table = new Table('users')

      const manager = table.from()
      manager.project(new SQLLiteral('*'))
      manager.from(table)
      manager.orders.push(new Ascending(new SQLLiteral('foo')))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT * FROM "users" ORDER BY foo ASC`,
      )
    })
  })

  describe('taken', () => {
    test('should return limit', () => {
      const manager = new SelectManager()
      manager.take(10)

      expect(manager.taken).toStrictEqual(10)
    })
  })

  describe('lock', () => {
    test('adds a lock node', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.lock().toSQL()).toStrictEqual(
        `SELECT FROM "users" FOR UPDATE`,
      )
    })

    test('takes a boolean', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.lock(true).toSQL()).toStrictEqual(
        `SELECT FROM "users" FOR UPDATE`,
      )
    })

    test('takes any value', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.lock(10).toSQL()).toStrictEqual(`SELECT FROM "users" 10`)
    })
  })

  describe('locked', () => {
    test('should return lock', () => {
      const table = new Table('users')

      const manager = table.from()

      expect(manager.locked).toStrictEqual(manager.ast.lock)
    })
  })

  describe('orders', () => {
    test('returns order clauses', () => {
      const table = new Table('users')

      const order = table.get('id')

      const manager = new SelectManager()
      manager.order(table.get('id'))

      expect(manager.orders).toStrictEqual([order])
    })
  })

  describe('order', () => {
    test('generates order clauses', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.project(new SQLLiteral('*'))
      manager.from(table)
      manager.order(table.get('id'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT * FROM "users" ORDER BY "users"."id"`,
      )
    })

    test('takes *args', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.project(new SQLLiteral('*'))
      manager.from(table)
      manager.order(table.get('id'), table.get('name'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT * FROM "users" ORDER BY "users"."id", "users"."name"`,
      )
    })

    test('chains', () => {
      const table = new Table('users')

      const manager = new SelectManager()

      expect(manager.order(table.get('id'))).toStrictEqual(manager)
    })

    test('has order attributes', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.project(new SQLLiteral('*'))
      manager.from(table)
      manager.order(table.get('id').desc())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT * FROM "users" ORDER BY "users"."id" DESC`,
      )
    })
  })

  describe('on', () => {
    test('takes two params', () => {
      const left = new Table('users')

      const right = left.alias()
      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager.join(right).on(predicate, predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" INNER JOIN "users" "users_2" ON "users"."id" = "users_2"."id" AND "users"."id" = "users_2"."id"`,
      )
    })

    test('takes three params', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager
        .join(right)
        .on(predicate, predicate, left.get('name').eq(right.get('name')))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" INNER JOIN "users" "users_2" ON "users"."id" = "users_2"."id" AND "users"."id" = "users_2"."id" AND "users"."name" = "users_2"."name"`,
      )
    })
  })

  test('should hand back constraints', () => {
    const table = new Table('users')

    const where = table.get('id').eq(10)

    const relation = new SelectManager()
    relation.where(where)

    expect(relation.constraints).toStrictEqual([where])
  })

  test('should hand back froms', () => {
    const relation = new SelectManager()

    expect(relation.froms).toStrictEqual([])
  })

  test('should create and nodes', () => {
    const relation = new SelectManager()

    const children = ['foo', 'bar', 'baz']

    const clause = relation.createAnd(children)

    expect(clause).toBeInstanceOf(And)
    expect(clause.children).toStrictEqual(children)
  })

  test('should create insert managers', () => {
    const relation = new SelectManager()

    const insert = relation.createInsert()

    expect(insert).toBeInstanceOf(InsertManager)
  })

  test('should create join nodes', () => {
    const relation = new SelectManager()

    const join = relation.createJoin('foo', 'bar')
    expect(join).toBeInstanceOf(InnerJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a full outer join klass', () => {
    const relation = new SelectManager()

    const join = relation.createJoin('foo', 'bar', FullOuterJoin)
    expect(join).toBeInstanceOf(FullOuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a outer join klass', () => {
    const relation = new SelectManager()

    const join = relation.createJoin('foo', 'bar', OuterJoin)
    expect(join).toBeInstanceOf(OuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  test('should create join nodes with a right outer join klass', () => {
    const relation = new SelectManager()

    const join = relation.createJoin('foo', 'bar', RightOuterJoin)
    expect(join).toBeInstanceOf(RightOuterJoin)
    expect(join.left).toStrictEqual('foo')
    expect(join.right).toStrictEqual('bar')
  })

  describe('join', () => {
    test('responds to join', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager.join(right).on(predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" INNER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('takes a class', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager.join(right, OuterJoin).on(predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" LEFT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('takes the full outer join class', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager.join(right, FullOuterJoin).on(predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" FULL OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('takes the right outer join class', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()
      manager.from(left)
      manager.join(right, RightOuterJoin).on(predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" RIGHT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('takes a string value', () => {
      const left = new Table('users')

      const manager = new SelectManager()
      manager.from(left)
      manager.join(
        'RIGHT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"',
      )

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" RIGHT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('noops on null', () => {
      const manager = new SelectManager()

      expect(manager.join(null)).toStrictEqual(manager)
    })

    test('raises EmptyJoinError on empty', () => {
      const left = new Table('users')

      const manager = new SelectManager()
      manager.from(left)

      expect(() => manager.join('')).toThrow(EmptyJoinError)
    })
  })

  describe('outer join', () => {
    test('responds to join', () => {
      const left = new Table('users')

      const right = left.alias()

      const predicate = left.get('id').eq(right.get('id'))

      const manager = new SelectManager()

      manager.from(left)
      manager.outerJoin(right).on(predicate)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" LEFT OUTER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('noops on null', () => {
      const manager = new SelectManager()

      expect(manager.outerJoin(null)).toStrictEqual(manager)
    })
  })

  describe('joins', () => {
    test('returns inner join sql', () => {
      const table = new Table('users')

      const aliaz = table.alias()

      const manager = new SelectManager()
      manager.from(new InnerJoin(aliaz, table.get('id').eq(aliaz.get('id'))))

      expect(manager.toSQL()).toMatch(
        `INNER JOIN "users" "users_2" "users"."id" = "users_2"."id"`,
      )
    })

    test('returns outer join sql', () => {
      const table = new Table('users')

      const aliaz = table.alias()

      const manager = new SelectManager()
      manager.from(new OuterJoin(aliaz, table.get('id').eq(aliaz.get('id'))))

      expect(manager.toSQL()).toMatch(
        `LEFT OUTER JOIN "users" "users_2" "users"."id" = "users_2"."id"`,
      )
    })

    test('can have a non-table alias as relation name', () => {
      const users = new Table('users')

      const comments = new Table('comments')

      const counts = comments
        .from()
        .group(comments.get('user_id'))
        .project(
          comments.get('user_id').as('user_id'),
          comments.get('user_id').count().as('count'),
        )
        .as('counts')

      const joins = users.join(counts).on(counts.get('user_id').eq(10))

      expect(joins.toSQL()).toStrictEqual(
        `SELECT FROM "users" INNER JOIN (SELECT "comments"."user_id" AS user_id, COUNT("comments"."user_id") AS count FROM "comments" GROUP BY "comments"."user_id") counts ON counts."user_id" = 10`,
      )
    })

    test('joins itself', () => {
      const left = new Table('users')
      const right = left.alias()
      const predicate = left.get('id').eq(right.get('id'))

      const manager = left.join(right)
      manager.project(new SQLLiteral('*'))

      expect(manager.on(predicate)).toStrictEqual(manager)
      expect(manager.toSQL()).toStrictEqual(
        `SELECT * FROM "users" INNER JOIN "users" "users_2" ON "users"."id" = "users_2"."id"`,
      )
    })

    test('returns string join sql', () => {
      const manager = new SelectManager()
      manager.from(new StringJoin(buildQuoted('hello')))

      expect(manager.toSQL()).toMatch(`'hello'`)
    })
  })

  describe('group', () => {
    test('takes an attribute', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.group(table.get('id'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" GROUP BY "users"."id"`,
      )
    })

    test('chains', () => {
      const table = new Table('users')

      const manager = new SelectManager()

      expect(manager.group(table.get('id'))).toStrictEqual(manager)
    })

    test('takes multiple args', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.group(table.get('id'), table.get('name'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" GROUP BY "users"."id", "users"."name"`,
      )
    })

    test('makes strings literals', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.group('foo')

      expect(manager.toSQL()).toStrictEqual(`SELECT FROM "users" GROUP BY foo`)
    })
  })

  describe('window definition', () => {
    test('can be empty', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window')

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS ()`,
      )
    })

    test('takes a string order', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').order('foo ASC')

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ORDER BY foo ASC)`,
      )
    })

    test('takes an order', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').order(table.get('foo').asc())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ORDER BY "users"."foo" ASC)`,
      )
    })

    test('takes an order with multiple columns', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager
        .window('a_window')
        .order(table.get('foo').asc(), table.get('bar').desc())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ORDER BY "users"."foo" ASC, "users"."bar" DESC)`,
      )
    })

    test('takes a partition', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').partition(table.get('bar'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (PARTITION BY "users"."bar")`,
      )
    })

    test('takes a string partition', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').partition('bar')

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (PARTITION BY bar)`,
      )
    })

    test('takes a partition and a frame', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager
        .window('a_window')
        .partition(table.get('foo'))
        .rows(new Preceding())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (PARTITION BY "users"."foo" ROWS UNBOUNDED PRECEDING)`,
      )
    })

    test('takes a partition and an order', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager
        .window('a_window')
        .partition(table.get('foo'))
        .order(table.get('foo').asc())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (PARTITION BY "users"."foo" ORDER BY "users"."foo" ASC)`,
      )
    })

    test('takes a partition with multiple columns', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').partition(table.get('bar'), table.get('baz'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (PARTITION BY "users"."bar", "users"."baz")`,
      )
    })

    test('takes a rows frame, unbounded preceding', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').rows(new Preceding())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS UNBOUNDED PRECEDING)`,
      )
    })

    test('does not override rows frame', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const window = manager.window('a_window')
      window.rows(new Preceding())
      window.rows(new Following())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS UNBOUNDED PRECEDING)`,
      )
    })

    test('takes a rows frame, bounded preceding', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').rows(new Preceding(5))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS 5 PRECEDING)`,
      )
    })

    test('takes a rows frame, unbounded following', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').rows(new Following())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS UNBOUNDED FOLLOWING)`,
      )
    })

    test('takes a rows frame, bounded following', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').rows(new Following(5))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS 5 FOLLOWING)`,
      )
    })

    test('takes a rows frame, current row', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').rows(new CurrentRow())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS CURRENT ROW)`,
      )
    })

    test('takes a rows frame, between two delimiters', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const window = manager.window('a_window')
      window.frame(
        new Between(
          window.rows(),
          new And([new Preceding(), new CurrentRow()]),
        ),
      )

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`,
      )
    })

    test('takes a range frame, unbounded preceding', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').range(new Preceding())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE UNBOUNDED PRECEDING)`,
      )
    })

    test('does not override range frame', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const window = manager.window('a_window')
      window.range(new Preceding())
      window.range(new Following())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE UNBOUNDED PRECEDING)`,
      )
    })

    test('takes a range frame, bounded preceding', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').range(new Preceding(5))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE 5 PRECEDING)`,
      )
    })

    test('takes a range frame, unbounded following', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').range(new Following())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE UNBOUNDED FOLLOWING)`,
      )
    })

    test('takes a range frame, bounded following', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').range(new Following(5))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE 5 FOLLOWING)`,
      )
    })

    test('takes a range frame, current row', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.window('a_window').range(new CurrentRow())

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE CURRENT ROW)`,
      )
    })

    test('takes a range frame, between two delimiters', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const window = manager.window('a_window')
      window.frame(
        new Between(
          window.range(),
          new And([new Preceding(), new CurrentRow()]),
        ),
      )

      expect(manager.toSQL()).toStrictEqual(
        `SELECT FROM "users" WINDOW "a_window" AS (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`,
      )
    })
  })

  describe('delete', () => {
    test('copies from', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const stmt = manager.compileDelete()

      expect(stmt.toSQL()).toStrictEqual(`DELETE FROM "users"`)
    })

    test('copies where', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))

      const stmt = manager.compileDelete()

      expect(stmt.toSQL()).toStrictEqual(
        `DELETE FROM "users" WHERE "users"."id" = 10`,
      )
    })

    test('copies limit', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.take(10)

      const stmt = manager.compileDelete()

      expect(stmt.toSQL()).toStrictEqual(`DELETE FROM "users" LIMIT 10`)
    })
  })

  describe('toSQL', () => {
    test('throws when visitor is null', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))

      if (SequelAST.engine) {
        const oldVisitor = SequelAST.engine.connection.visitor
        SequelAST.engine.connection.visitor = null

        expect(() => manager.toSQL(SequelAST.engine)).toThrow(
          VisitorNotSetError,
        )

        SequelAST.engine.connection.visitor = oldVisitor
      }
    })
  })

  describe('whereSQL', () => {
    test('gives me back the where sql', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))

      expect(manager.toSQL()).toMatch(`WHERE "users"."id" = 10`)
    })

    test('joins wheres with AND', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))
      manager.where(table.get('id').eq(11))

      expect(manager.toSQL()).toMatch(
        `WHERE "users"."id" = 10 AND "users"."id" = 11`,
      )
    })

    test('handles database specific statements', () => {
      if (SequelAST.engine) {
        const oldVisitor = SequelAST.engine.connection.visitor

        SequelAST.engine.connection.visitor = new PostgreSQL(
          SequelAST.engine.connection,
        )

        const table = new Table('users')

        const manager = new SelectManager()
        manager.from(table)
        manager.where(table.get('id').eq(10))
        manager.where(table.get('name').matches('foo%'))

        expect(String(manager.whereSQL())).toMatch(
          `WHERE "users"."id" = 10 AND "users"."name" ILIKE 'foo%'`,
        )

        SequelAST.engine.connection.visitor = oldVisitor
      } else {
        expect(true).toBeFalsy()
      }
    })

    test('returns null when there are no wheres', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      expect(manager.whereSQL()).toBeNull()
    })

    test('throws when engine is null', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))

      expect(() => manager.whereSQL(null)).toThrow(EngineNotSetError)
    })

    test('throws when visitor is null', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.where(table.get('id').eq(10))

      if (SequelAST.engine) {
        const oldVisitor = SequelAST.engine.connection.visitor
        SequelAST.engine.connection.visitor = null

        expect(() => manager.whereSQL(SequelAST.engine)).toThrow(
          VisitorNotSetError,
        )

        SequelAST.engine.connection.visitor = oldVisitor
      }
    })
  })

  describe('update', () => {
    test('creates an update statement', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const stmt = manager.compileUpdate(
        [[table.get('id'), 1]],
        new Attribute(table, 'id'),
      )

      expect(stmt.toSQL()).toStrictEqual(`UPDATE "users" SET "id" = 1`)
    })

    test('takes a string', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      const stmt = manager.compileUpdate(
        new SQLLiteral('foo = bar'),
        new Attribute(table, 'id'),
      )

      expect(stmt.toSQL()).toStrictEqual(`UPDATE "users" SET foo = bar`)
    })

    test('copies limits', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.take(1)

      const stmt = manager.compileUpdate(
        new SQLLiteral('foo = bar'),
        new Attribute(table, 'id'),
      )
      stmt.key = table.get('id')

      expect(stmt.toSQL()).toStrictEqual(
        `UPDATE "users" SET foo = bar WHERE "users"."id" IN (SELECT "users"."id" FROM "users" LIMIT 1)`,
      )
    })

    test('copies order', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.order('foo')

      const stmt = manager.compileUpdate(
        new SQLLiteral('foo = bar'),
        new Attribute(table, 'id'),
      )
      stmt.key = table.get('id')

      expect(stmt.toSQL()).toStrictEqual(
        `UPDATE "users" SET foo = bar WHERE "users"."id" IN (SELECT "users"."id" FROM "users" ORDER BY foo)`,
      )
    })

    test('copies where clauses', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.where(table.get('id').eq(10))
      manager.from(table)

      const stmt = manager.compileUpdate(
        [[table.get('id'), 1]],
        new Attribute(table, 'id'),
      )

      expect(stmt.toSQL()).toStrictEqual(
        `UPDATE "users" SET "id" = 1 WHERE "users"."id" = 10`,
      )
    })

    test('copies where clauses when nesting is triggered', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.where(table.get('foo').eq(10))
      manager.take(42)
      manager.from(table)

      const stmt = manager.compileUpdate(
        [[table.get('id'), 1]],
        new Attribute(table, 'id'),
      )

      expect(stmt.toSQL()).toStrictEqual(
        `UPDATE "users" SET "id" = 1 WHERE "users"."id" IN (SELECT "users"."id" FROM "users" WHERE "users"."foo" = 10 LIMIT 42)`,
      )
    })
  })

  describe('project', () => {
    test('takes sql literals', () => {
      const manager = new SelectManager()
      manager.project(new SQLLiteral('*'))

      expect(manager.toSQL()).toStrictEqual(`SELECT *`)
    })

    test('takes multiple args', () => {
      const manager = new SelectManager()
      manager.project(new SQLLiteral('foo'), new SQLLiteral('bar'))

      expect(manager.toSQL()).toStrictEqual(`SELECT foo, bar`)
    })

    test('takes strings', () => {
      const manager = new SelectManager()
      manager.project('*')

      expect(manager.toSQL()).toStrictEqual(`SELECT *`)
    })
  })

  describe('projections', () => {
    test('reads projections', () => {
      const manager = new SelectManager()
      manager.project(new SQLLiteral('foo'), new SQLLiteral('bar'))

      expect(manager.projections).toStrictEqual([
        new SQLLiteral('foo'),
        new SQLLiteral('bar'),
      ])
    })

    test('overwrites projections', () => {
      const manager = new SelectManager()
      manager.project(new SQLLiteral('foo'))
      manager.projections = [new SQLLiteral('bar')]

      expect(manager.toSQL()).toStrictEqual(`SELECT bar`)
    })
  })

  describe('take', () => {
    test('knows take', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.where(table.get('id').eq(1))
      manager.take(1)

      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" = 1 LIMIT 1`,
      )
    })

    test('chains', () => {
      const manager = new SelectManager()

      expect(manager.take(1)).toStrictEqual(manager)
    })

    test('removes LIMIT when null is passed', () => {
      const manager = new SelectManager()
      manager.limit = 10

      expect(manager.toSQL()).toMatch('LIMIT')

      manager.limit = null

      expect(manager.toSQL()).not.toMatch('LIMIT')
    })
  })

  describe('where', () => {
    test('knows where', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.where(table.get('id').eq(1))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" WHERE "users"."id" = 1`,
      )
    })

    test('chains', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)

      expect(
        manager.project(table.get('id')).where(table.get('id').eq(1)),
      ).toStrictEqual(manager)
    })
  })

  describe('from', () => {
    test('makes sql', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.project(table.get('id'))

      expect(manager.toSQL()).toStrictEqual(`SELECT "users"."id" FROM "users"`)
    })

    test('chains', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      expect(manager.from(table).project(table.get('id'))).toStrictEqual(
        manager,
      )

      expect(manager.toSQL()).toStrictEqual(`SELECT "users"."id" FROM "users"`)
    })
  })

  describe('source', () => {
    test('returns the join source of the select core', () => {
      const manager = new SelectManager()

      expect(
        manager.ast.cores[manager.ast.cores.length - 1].source,
      ).toStrictEqual(manager.source)
    })
  })

  describe('distinct', () => {
    test('sets the quantifier', () => {
      const manager = new SelectManager()

      manager.distinct()

      expect(
        manager.ast.cores[manager.ast.cores.length - 1].setQuantifier,
      ).toBeInstanceOf(Distinct)

      manager.distinct(false)

      expect(
        manager.ast.cores[manager.ast.cores.length - 1].setQuantifier,
      ).toBeNull()
    })

    test('chains', () => {
      const manager = new SelectManager()

      expect(manager.distinct()).toStrictEqual(manager)
      expect(manager.distinct(false)).toStrictEqual(manager)
    })
  })

  describe('distinct_on', () => {
    test('sets the quantifier', () => {
      const manager = new SelectManager()
      const table = new Table('users')

      manager.distinctOn(table.get('id'))

      expect(
        manager.ast.cores[manager.ast.cores.length - 1].setQuantifier,
      ).toStrictEqual(new DistinctOn(table.get('id')))

      manager.distinctOn(false)

      expect(
        manager.ast.cores[manager.ast.cores.length - 1].setQuantifier,
      ).toBeNull()
    })

    test('chains', () => {
      const manager = new SelectManager()
      const table = new Table('users')

      expect(manager.distinctOn(table.get('id'))).toStrictEqual(manager)
      expect(manager.distinctOn(false)).toStrictEqual(manager)
    })
  })

  describe('comment', () => {
    test('chains', () => {
      const manager = new SelectManager()

      expect(manager.comment('selecting')).toStrictEqual(manager)
    })

    test('appends a comment to the generated query', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.comment('selecting')

      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" /* selecting */`,
      )

      manager.comment('selecting', 'with', 'comment')

      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" /* selecting */ /* with */ /* comment */`,
      )
    })

    test('accepts a SQLLiteral as a comment', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.comment(new SQLLiteral('selecting'))

      expect(manager.toSQL()).toStrictEqual(
        `SELECT "users"."id" FROM "users" /* selecting */`,
      )
    })
  })

  describe('optimizerHints', () => {
    test('chains', () => {
      const manager = new SelectManager()

      expect(manager.optimizerHints('optimizer hints')).toStrictEqual(manager)
    })

    test('should handle optimizerHints', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.optimizerHints(
        'MAX_EXECUTION_TIME(50000)',
        'NO_INDEX_MERGE(topics)',
      )

      expect(manager.toSQL()).toStrictEqual(
        `SELECT /*+ MAX_EXECUTION_TIME(50000) NO_INDEX_MERGE(topics) */ "users"."id" FROM "users"`,
      )
    })

    test('noops on null', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table).project(table.get('id'))
      manager.optimizerHints()

      expect(manager.toSQL()).toStrictEqual(`SELECT "users"."id" FROM "users"`)
    })
  })
})
