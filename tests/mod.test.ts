import * as Attributes from '../src/attributes/mod.js'
import * as Collectors from '../src/collectors/mod.js'
import * as Errors from '../src/errors/mod.js'
import * as Interfaces from '../src/interfaces/mod.js'
import * as Managers from '../src/managers/mod.js'
import * as Nodes from '../src/nodes/mod.js'
import * as Visitors from '../src/visitors/mod.js'

import SequelAST from '../src/SequelAST.js'
import Table from '../src/Table.js'

import * as mod from '../src/mod.js'

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
