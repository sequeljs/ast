import '../helper'

import Engine from '../../src/interfaces/Engine'

import InsertManager from '../../src/managers/InsertManager'
import SelectManager from '../../src/managers/SelectManager'

import SQLLiteral from '../../src/nodes/SQLLiteral'
import ValuesList from '../../src/nodes/ValuesList'

import Table from '../../src/Table'

import FakeRecord from '../support/FakeRecord'

const scope: {
  engine: Engine
} = {
  engine: new FakeRecord(),
}

describe('InsertManager', () => {
  beforeEach(() => {
    scope.engine = new FakeRecord()
  })

  describe('insert', () => {
    test('can create a ValuesList node', () => {
      const manager = new InsertManager()
      const node = manager.createValuesList([
        ['a', 'b'],
        ['c', 'd'],
      ])

      expect(node).toBeInstanceOf(ValuesList)
      expect(node.rows).toStrictEqual([
        ['a', 'b'],
        ['c', 'd'],
      ])
    })

    test('allows SQL literals', () => {
      const manager = new InsertManager()
      manager.into(new Table('users'))
      manager.values = manager.createValues([new SQLLiteral('*')])

      expect(manager.toSQL()).toStrictEqual(`INSERT INTO "users" VALUES (*)`)
    })

    test('works with multiple values', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)

      manager.columns.push(table.get('id'))
      manager.columns.push(table.get('name'))

      manager.values = manager.createValuesList([
        ['1', 'david'],
        ['2', 'kir'],
        ['3', new SQLLiteral('DEFAULT')],
      ])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id", "name") VALUES ('1', 'david'), ('2', 'kir'), ('3', DEFAULT)`,
      )
    })

    test('literals in multiple values are not escaped', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.columns.push(table.get('name'))
      manager.values = manager.createValuesList([
        [new SQLLiteral('*')],
        [new SQLLiteral('DEFAULT')],
      ])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("name") VALUES (*), (DEFAULT)`,
      )
    })

    test('works with multiple single values', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.columns.push(table.get('name'))
      manager.values = manager.createValuesList([
        ['david'],
        ['kir'],
        [new SQLLiteral('DEFAULT')],
      ])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("name") VALUES ('david'), ('kir'), (DEFAULT)`,
      )
    })

    test('inserts false', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.insert([[table.get('bool'), false]])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("bool") VALUES ('f')`,
      )
    })

    test('inserts null', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.insert([[table.get('id'), null]])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id") VALUES (NULL)`,
      )
    })

    test('inserts time', () => {
      const table = new Table('users')

      const time = new Date()
      const attribute = table.get('created_at')

      const manager = new InsertManager()
      manager.insert([[attribute, time]])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("created_at") VALUES (${scope.engine.connection.quote(
          time,
        )})`,
      )
    })

    test('takes a list of lists', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.insert([
        [table.get('id'), 1],
        [table.get('name'), 'aaron'],
      ])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id", "name") VALUES (1, 'aaron')`,
      )
    })

    test('defaults the table', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.insert([
        [table.get('id'), 1],
        [table.get('name'), 'aaron'],
      ])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id", "name") VALUES (1, 'aaron')`,
      )
    })

    test('noop for empty list', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.insert([[table.get('id'), 1]])
      manager.insert([])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id") VALUES (1)`,
      )
    })

    test('is chainable', () => {
      const table = new Table('users')

      const manager = new InsertManager()

      const insertResult = manager.insert([[table.get('id'), 1]])

      expect(insertResult).toStrictEqual(manager)
    })
  })

  describe('into', () => {
    test('takes a Table and chains', () => {
      const manager = new InsertManager()

      expect(manager.into(new Table('users'))).toStrictEqual(manager)
    })

    test('converts to sql', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)

      expect(manager.toSQL()).toStrictEqual(`INSERT INTO "users"`)
    })
  })

  describe('columns', () => {
    test('converts to sql', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.columns.push(table.get('id'))

      expect(manager.toSQL()).toStrictEqual(`INSERT INTO "users" ("id")`)
    })
  })

  describe('values', () => {
    test('converts to sql', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.values = new ValuesList([[1], [2]])

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" VALUES (1), (2)`,
      )
    })

    test('accepts sql literals', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.values = new SQLLiteral('DEFAULT VALUES')

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" DEFAULT VALUES`,
      )
    })
  })

  describe('combo', () => {
    test('combines columns and values list in order', () => {
      const table = new Table('users')

      const manager = new InsertManager()
      manager.into(table)
      manager.values = new ValuesList([
        [1, 'aaron'],
        [2, 'david'],
      ])
      manager.columns.push(table.get('id'))
      manager.columns.push(table.get('name'))

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id", "name") VALUES (1, 'aaron'), (2, 'david')`,
      )
    })
  })

  describe('select', () => {
    test('accepts a select query in place of a VALUES clause', () => {
      const table = new Table('users')

      const select = new SelectManager()
      select.project(new SQLLiteral('1'))
      select.project(new SQLLiteral('"aaron"'))

      const manager = new InsertManager()
      manager.into(table)
      manager.select(select)
      manager.columns.push(table.get('id'))
      manager.columns.push(table.get('name'))

      expect(manager.toSQL()).toStrictEqual(
        `INSERT INTO "users" ("id", "name") (SELECT 1, "aaron")`,
      )
    })
  })
})
