import * as mod from '../../src/collectors/mod'
import Bind from '../../src/collectors/Bind'
import Composite from '../../src/collectors/Composite'
import SQLString from '../../src/collectors/SQLString'
import SubstituteBinds from '../../src/collectors/SubstituteBinds'

test('exports from module', () => {
  expect(mod.Bind).toStrictEqual(Bind)
  expect(mod.Composite).toStrictEqual(Composite)
  expect(mod.SQLString).toStrictEqual(SQLString)
  expect(mod.SubstituteBinds).toStrictEqual(SubstituteBinds)
})
