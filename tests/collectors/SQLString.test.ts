import '../helper.js'

import SQLString from '../../src/collectors/SQLString.js'

import SelectManager from '../../src/managers/SelectManager.js'

import BindParam from '../../src/nodes/BindParam.js'

import ToSQL from '../../src/visitors/ToSQL.js'
import Visitable from '../../src/visitors/Visitable.js'

import Table from '../../src/Table.js'

import type SelectStatement from '../../src/nodes/SelectStatement.js'

import FakeRecord from '../support/FakeRecord.js'

const connection = new FakeRecord()
const visitor = new ToSQL(connection.connection)

function astWithBinds(): SelectStatement {
  const table = new Table('users')

  const manager = new SelectManager(table)
  manager.where(table.get('age').eq(new BindParam('hello')))
  manager.where(table.get('name').eq(new BindParam('world')))

  return manager.ast
}

function collect(node: Visitable): SQLString {
  return visitor.accept(node, new SQLString())
}

function compile(node: Visitable): string {
  return collect(node).value
}

test('compile', () => {
  const stmt = astWithBinds()

  expect(compile(stmt)).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = ? AND "users"."name" = ?`,
  )
})
