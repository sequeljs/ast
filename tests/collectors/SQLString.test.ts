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
