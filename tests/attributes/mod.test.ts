import * as mod from '../../src/attributes/mod'
import Attribute from '../../src/attributes/Attribute'
import Boolean from '../../src/attributes/Boolean'
import Decimal from '../../src/attributes/Decimal'
import Float from '../../src/attributes/Float'
import Integer from '../../src/attributes/Integer'
import String from '../../src/attributes/String'
import Time from '../../src/attributes/Time'
import Undefined from '../../src/attributes/Undefined'
import attributeFor from '../../src/attributes/attributeFor'

test('exports from module', () => {
  expect(mod.Attribute).toStrictEqual(Attribute)
  expect(mod.Boolean).toStrictEqual(Boolean)
  expect(mod.Decimal).toStrictEqual(Decimal)
  expect(mod.Float).toStrictEqual(Float)
  expect(mod.Integer).toStrictEqual(Integer)
  expect(mod.String).toStrictEqual(String)
  expect(mod.Time).toStrictEqual(Time)
  expect(mod.Undefined).toStrictEqual(Undefined)
  expect(mod.attributeFor).toStrictEqual(attributeFor)
})
