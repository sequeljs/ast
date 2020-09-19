import '../helper.js'

import Bind from '../../src/collectors/Bind.js'

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

function collect(node: Visitable): Bind {
  return visitor.accept(node, new Bind())
}

function compile(node: Visitable): string[] {
  return collect(node).value
}

test('compile gathers all bind params', () => {
  let binds

  binds = compile(astWithBinds(['hello', 'world']))

  expect(binds).toStrictEqual(['hello', 'world'])

  binds = compile(astWithBinds(['hello2', 'world3']))

  expect(binds).toStrictEqual(['hello2', 'world3'])
})
