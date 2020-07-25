import * as Attributes from '../src/attributes/mod'
import * as Collectors from '../src/collectors/mod'
import * as Errors from '../src/errors/mod'
import * as Interfaces from '../src/interfaces/mod'
import * as Managers from '../src/managers/mod'
import * as Nodes from '../src/nodes/mod'
import * as Visitors from '../src/visitors/mod'

import SequelAST from '../src/SequelAST'
import Table from '../src/Table'

import * as mod from '../src/mod'

test('exports from module', () => {
  expect(Attributes).toStrictEqual(mod.Attributes)
  expect(Collectors).toStrictEqual(mod.Collectors)
  expect(Errors).toStrictEqual(mod.Errors)
  expect(Interfaces).toStrictEqual(mod.Interfaces)
  expect(Managers).toStrictEqual(mod.Managers)
  expect(Nodes).toStrictEqual(mod.Nodes)
  expect(SequelAST).toStrictEqual(mod.SequelAST)
  expect(Table).toStrictEqual(mod.Table)
  expect(Visitors).toStrictEqual(mod.Visitors)
})
