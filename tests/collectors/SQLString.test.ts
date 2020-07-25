import '../helper'

import SQLString from '../../src/collectors/SQLString'

import SelectManager from '../../src/managers/SelectManager'

import BindParam from '../../src/nodes/BindParam'

import ToSQL from '../../src/visitors/ToSQL'
import Visitable from '../../src/visitors/Visitable'

import Table from '../../src/Table'

import type SelectStatement from '../../src/nodes/SelectStatement'

import FakeRecord from '../support/FakeRecord'

const connection = new FakeRecord()
const visitor = new ToSQL(connection.connection)

function astWithBinds(bv: BindParam): SelectStatement {
  const table = new Table('users')

  const manager = new SelectManager(table)
  manager.where(table.get('age').eq(bv))
  manager.where(table.get('name').eq(bv))

  return manager.ast
}

function collect(node: Visitable): SQLString {
  return visitor.accept(node, new SQLString())
}

test('compile', () => {
  const bv = new BindParam(1)

  const collector = collect(astWithBinds(bv))

  const sql = collector.compile(['hello', 'world'])

  expect(sql).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = ? AND "users"."name" = ?`,
  )
})
