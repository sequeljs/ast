import * as mod from '../../src/attributes/mod.js'
import Attribute from '../../src/attributes/Attribute.js'
import Boolean from '../../src/attributes/Boolean.js'
import Decimal from '../../src/attributes/Decimal.js'
import Float from '../../src/attributes/Float.js'
import Integer from '../../src/attributes/Integer.js'
import String from '../../src/attributes/String.js'
import Time from '../../src/attributes/Time.js'
import Undefined from '../../src/attributes/Undefined.js'

test('exports from module', () => {
  expect(mod.Attribute).toStrictEqual(Attribute)
  expect(mod.Boolean).toStrictEqual(Boolean)
  expect(mod.Decimal).toStrictEqual(Decimal)
  expect(mod.Float).toStrictEqual(Float)
  expect(mod.Integer).toStrictEqual(Integer)
  expect(mod.String).toStrictEqual(String)
  expect(mod.Time).toStrictEqual(Time)
  expect(mod.Undefined).toStrictEqual(Undefined)
})
