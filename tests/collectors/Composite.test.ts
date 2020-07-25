import '../helper'

import Bind from '../../src/collectors/Bind'
import Composite from '../../src/collectors/Composite'
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
