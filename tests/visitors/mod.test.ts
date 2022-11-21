import * as mod from '../../src/visitors/mod'
import MySQL from '../../src/visitors/MySQL'
import PostgreSQL from '../../src/visitors/PostgreSQL'
import ToSQL from '../../src/visitors/ToSQL'
import Visitor from '../../src/visitors/Visitor'
import WhereSQL from '../../src/visitors/WhereSQL'

test('exports from module', () => {
  expect(mod.MySQL).toStrictEqual(MySQL)
  expect(mod.PostgreSQL).toStrictEqual(PostgreSQL)
  expect(mod.ToSQL).toStrictEqual(ToSQL)
  expect(mod.Visitor).toStrictEqual(Visitor)
  expect(mod.WhereSQL).toStrictEqual(WhereSQL)
})
