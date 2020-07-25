import '../helper'

import SQLString from '../../src/collectors/SQLString'

import SelectManager from '../../src/managers/SelectManager'
import UpdateManager from '../../src/managers/UpdateManager'

import Limit from '../../src/nodes/Limit'
import Lock from '../../src/nodes/Lock'
import Offset from '../../src/nodes/Offset'
import SQLLiteral from '../../src/nodes/SQLLiteral'
import SelectStatement from '../../src/nodes/SelectStatement'
import Union from '../../src/nodes/Union'
import UpdateStatement from '../../src/nodes/UpdateStatement'
import buildQuoted from '../../src/nodes/buildQuoted'

import MySQL from '../../src/visitors/MySQL'
import Visitable from '../../src/visitors/Visitable'
import Visitor from '../../src/visitors/Visitor'

import SequelAST from '../../src/SequelAST'
import Table from '../../src/Table'

const scope: { visitor: Visitor } = {
  visitor: new (class extends Visitor {})(),
}

function compile(node: Visitable): string {
  return scope.visitor.accept(node, new SQLString()).value
}

describe('MySQL Visitor', () => {
  beforeEach(() => {
    if (SequelAST.engine) {
      scope.visitor = new MySQL(SequelAST.engine.connection)
    }
  })

  test('squashes parenthesis on multiple unions', () => {
    const subnode1 = new Union(new SQLLiteral('left'), new SQLLiteral('right'))
    const node1 = new Union(subnode1, new SQLLiteral('topright'))

    expect(compile(node1).match(/\(/g)).toHaveLength(1)

    const subnode2 = new Union(new SQLLiteral('left'), new SQLLiteral('right'))
    const node2 = new Union(new SQLLiteral('topleft'), subnode2)

    expect(compile(node2).match(/\(/g)).toHaveLength(1)
  })

  test('defaults limit to 18446744073709551615', () => {
    const stmt = new SelectStatement()
    stmt.offset = new Offset(1)

    expect(compile(stmt)).toStrictEqual(
      `SELECT FROM DUAL LIMIT 18446744073709551615 OFFSET 1`,
    )
  })

  test('should escape limit', () => {
    const stmt = new UpdateStatement()
    stmt.relation = new Table('users')
    stmt.limit = new Limit(buildQuoted('omg'))

    expect(compile(stmt)).toStrictEqual(`UPDATE "users" LIMIT 'omg'`)
  })

  test('uses DUAL for empty from', () => {
    const stmt = new SelectStatement()

    expect(compile(stmt)).toStrictEqual(`SELECT FROM DUAL`)
  })

  describe('locking', () => {
    test('defaults to FOR UPDATE when locking', () => {
      const node = new Lock(new SQLLiteral('FOR UPDATE'))

      expect(compile(node)).toStrictEqual(`FOR UPDATE`)
    })

    test('allows a custom string to be used as a lock', () => {
      const node = new Lock(new SQLLiteral('LOCK IN SHARE MODE'))

      expect(compile(node)).toStrictEqual(`LOCK IN SHARE MODE`)
    })
  })

  describe('concat', () => {
    test('concats columns', () => {
      const table = new Table('users')

      const query = table.get('name').concat(table.get('name'))

      expect(compile(query)).toMatch(`CONCAT("users"."name", "users"."name")`)
    })

    test('concats a string', () => {
      const table = new Table('users')

      const query = table.get('name').concat(buildQuoted('abc'))

      expect(compile(query)).toMatch(`CONCAT("users"."name", 'abc')`)
    })
  })

  describe('SelectManager', () => {
    test('accepts strings as SQLLiterals', () => {
      const table = new Table('users')

      const manager = new SelectManager()
      manager.from(table)
      manager.project(table.get('id'))

      expect(compile(manager)).toMatch(`SELECT "users"."id" FROM "users"`)
    })
  })

  describe('UpdateManager', () => {
    test('takes values', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.set(new SQLLiteral('foo = bar'))

      expect(compile(um.ast)).toStrictEqual(`UPDATE "users" SET foo = bar`)
    })

    test('generates an order clause', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.order(table.get('id'))

      expect(compile(um.ast)).toStrictEqual(`UPDATE "users" ORDER BY "users"."id"`)
    })

    test('generates a where clause', () => {
      const table = new Table('users')

      const um = new UpdateManager()
      um.table(table)
      um.where(table.get('id').eq(1))

      expect(compile(um.ast)).toStrictEqual(`UPDATE "users" WHERE "users"."id" = 1`)
    })
  })
})
