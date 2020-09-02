import '../helper.js'

import SQLString from '../../src/collectors/SQLString.js'
import SubstituteBinds from '../../src/collectors/SubstituteBinds.js'

import SelectManager from '../../src/managers/SelectManager.js'

import BindParam from '../../src/nodes/BindParam.js'

import ToSQL from '../../src/visitors/ToSQL.js'
import Visitable from '../../src/visitors/Visitable.js'

import Table from '../../src/Table.js'

import type Quoter from '../../src/interfaces/Quoter.js'

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

function compile(node: Visitable, quoter: Quoter): string {
  const collector = new SubstituteBinds(quoter, new SQLString())

  return visitor.accept(node, collector).value
}

test('compile', () => {
  const quoter = {
    quote(value: number | string): number | string {
      return String(value)
    },
    quoteColumnName(value: number | string): string {
      return String(value)
    },
    quoteTableName(value: number | string): string {
      return String(value)
    },
  }

  const sql = compile(astWithBinds(), quoter)

  expect(sql).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = hello AND "users"."name" = world`,
  )
})

test('quoting is delegated to quoter', () => {
  const quoter = {
    quote(value: number | string): number | string {
      return String(`"${value}"`)
    },
    quoteColumnName(value: number | string): string {
      return String(value)
    },
    quoteTableName(value: number | string): string {
      return String(value)
    },
  }

  const sql = compile(astWithBinds(), quoter)

  expect(sql).toStrictEqual(
    `SELECT FROM "users" WHERE "users"."age" = "hello" AND "users"."name" = "world"`,
  )
})
