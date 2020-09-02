import * as mod from '../../src/visitors/mod.js'
import MySQL from '../../src/visitors/MySQL.js'
import PostgreSQL from '../../src/visitors/PostgreSQL.js'
import ToSQL from '../../src/visitors/ToSQL.js'
import Visitor from '../../src/visitors/Visitor.js'
import WhereSQL from '../../src/visitors/WhereSQL.js'

test('exports from module', () => {
  expect(mod.MySQL).toStrictEqual(MySQL)
  expect(mod.PostgreSQL).toStrictEqual(PostgreSQL)
  expect(mod.ToSQL).toStrictEqual(ToSQL)
  expect(mod.Visitor).toStrictEqual(Visitor)
  expect(mod.WhereSQL).toStrictEqual(WhereSQL)
})
