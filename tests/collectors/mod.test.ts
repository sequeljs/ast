import * as mod from '../../src/collectors/mod.js'
import Bind from '../../src/collectors/Bind.js'
import Composite from '../../src/collectors/Composite.js'
import SQLString from '../../src/collectors/SQLString.js'
import SubstituteBinds from '../../src/collectors/SubstituteBinds.js'

test('exports from module', () => {
  expect(mod.Bind).toStrictEqual(Bind)
  expect(mod.Composite).toStrictEqual(Composite)
  expect(mod.SQLString).toStrictEqual(SQLString)
  expect(mod.SubstituteBinds).toStrictEqual(SubstituteBinds)
})
