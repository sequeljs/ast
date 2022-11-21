import '../helper'

import SQLString from '../../src/collectors/SQLString'
import SubstituteBinds from '../../src/collectors/SubstituteBinds'

import SelectManager from '../../src/managers/SelectManager'

import BindParam from '../../src/nodes/BindParam'

import ToSQL from '../../src/visitors/ToSQL'
import Visitable from '../../src/visitors/Visitable'

import Table from '../../src/Table'

import type Quoter from '../../src/interfaces/Quoter'

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
