import '../helper'

import UpdateManager from '../../src/managers/UpdateManager'

import BindParam from '../../src/nodes/BindParam'
import JoinSource from '../../src/nodes/JoinSource'
import SQLLiteral from '../../src/nodes/SQLLiteral'

import Table from '../../src/Table'

const scope: { table: Table; updateManager: UpdateManager } = {
  table: new Table(''),
  updateManager: new UpdateManager(),
}

describe('UpdateManager', () => {
  test('should not quote SQLLiterals', () => {
    const table = new Table('users')

    const um = new UpdateManager()
    um.table(table)
    um.set([[table.get('name'), new BindParam(1)]])

    expect(um.toSQL()).toStrictEqual(`UPDATE "users" SET "name" = ?`)
  })

  describe('limit', () => {
    test('handles limit properly', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.key = 'id'
      um.take(10)
      um.table(table)
      um.set([[table.get('name'), null]])

      expect(um.toSQL()).toMatch(`LIMIT 10`)
    })

    test('noops on null', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.key = 'id'
      um.take(null)
      um.table(table)
      um.set([[table.get('name'), null]])

      expect(um.toSQL()).not.toMatch(`LIMIT`)
    })
  })

  describe('set', () => {
    test('updates with null', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.set([[table.get('name'), null]])

      expect(um.toSQL()).toStrictEqual(`UPDATE "users" SET "name" = NULL`)
    })

    test('takes a string', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.set(new SQLLiteral('foo = bar'))

      expect(um.toSQL()).toStrictEqual(`UPDATE "users" SET foo = bar`)
    })

    test('takes a list of lists', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.set([
        [table.get('id'), 1],
        [table.get('name'), 'hello'],
      ])

      expect(um.toSQL()).toStrictEqual(
        `UPDATE "users" SET "id" = 1, "name" = 'hello'`,
      )
    })

    test('chains', () => {
      const table = new Table('users')

      const um = new UpdateManager()

      expect(
        um.set([
          [table.get('id'), 1],
          [table.get('name'), 'hello'],
        ]),
      ).toStrictEqual(um)
    })
  })

  describe('table', () => {
    test('generates an update statement', () => {
      const um = new UpdateManager()
      um.table(new Table('users'))

      expect(um.toSQL()).toStrictEqual(`UPDATE "users"`)
    })

    test('chains', () => {
      const um = new UpdateManager()

      expect(um.table(new Table('users'))).toStrictEqual(um)
    })

    test('generates an update statement with joins', () => {
      const um = new UpdateManager()

      const table = new Table('users')
      const joinSource = new JoinSource(table, [
        table.createJoin(new Table('posts')),
      ])

      um.table(joinSource)

      expect(um.toSQL()).toStrictEqual(`UPDATE "users" INNER JOIN "posts"`)
    })
  })

  describe('where', () => {
    test('generates a where clause', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.where(table.get('id').eq(1))

      expect(um.toSQL()).toStrictEqual(`UPDATE "users" WHERE "users"."id" = 1`)
    })

    test('chains', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)

      expect(um.where(table.get('id').eq(1))).toStrictEqual(um)
    })
  })

  describe('key', () => {
    beforeEach(() => {
      scope.table = new Table('users')
      scope.updateManager = new UpdateManager()
      scope.updateManager.key = scope.table.get('foo')
    })

    test('can be set', () => {
      expect(scope.updateManager.ast.key).toStrictEqual(scope.table.get('foo'))
    })

    test('can be accessed', () => {
      expect(scope.updateManager.key).toStrictEqual(scope.table.get('foo'))
    })
  })
})
