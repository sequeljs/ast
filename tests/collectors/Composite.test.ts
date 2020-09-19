import '../helper.js'

import Bind from '../../src/collectors/Bind.js'
import Composite from '../../src/collectors/Composite.js'
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

function astWithBinds(bvs: [string, string]): SelectStatement {
  const table = new Table('users')

  const manager = new SelectManager(table)
  manager.where(table.get('age').eq(new BindParam(bvs.shift())))
  manager.where(table.get('name').eq(new BindParam(bvs.shift())))

  return manager.ast
}

function collect(node: Visitable): Composite<SQLString, Bind> {
  const sqlCollector = new SQLString()
  const bindCollector = new Bind()

  const collector = new Composite(sqlCollector, bindCollector)

  return visitor.accept(node, collector)
}

function compile(node: Visitable): [string, string | string[]] {
  return collect(node).value
}

test('composite collector performs multiple collections at once', () => {
  let compiled

  compiled = compile(astWithBinds(['hello', 'world']))

  expect(compiled[0]).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = ? AND "users"."name" = ?`,
  )
  expect(compiled[1]).toStrictEqual(['hello', 'world'])

  compiled = compile(astWithBinds(['hello2', 'world3']))

  expect(compiled[0]).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = ? AND "users"."name" = ?`,
  )
  expect(compiled[1]).toStrictEqual(['hello2', 'world3'])
})
