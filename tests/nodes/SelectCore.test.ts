import '../helper'

import SQLString from '../../src/collectors/SQLString'

import Distinct from '../../src/nodes/Distinct'
import SelectCore from '../../src/nodes/SelectCore'

import ToSQL from '../../src/visitors/ToSQL'

import SequelAST from '../../src/SequelAST'

import type FakeRecord from '../support/FakeRecord'

describe('SelectCore', () => {
  test('set quantifier', () => {
    const core = new SelectCore()
    core.setQuantifier = new Distinct()

    const engine = SequelAST.engine as FakeRecord

    const visitor = new ToSQL(engine.connection)

    expect(visitor.accept(core, new SQLString()).value).toMatch('DISTINCT')
  })

  test('should set from', () => {
    const core = new SelectCore()
    core.froms = ['a', 'b', 'c']

    expect(core.from).toStrictEqual(core.froms)
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const core1 = new SelectCore()
      core1.from = ['a', 'b', 'c']
      core1.projections = ['d', 'e', 'f']
      core1.wheres = ['g', 'h', 'i']
      core1.groups = ['j', 'k', 'l']
      core1.windows = ['m', 'n', 'o']
      core1.havings = ['p', 'q', 'r']

      const core2 = new SelectCore()
      core2.from = ['a', 'b', 'c']
      core2.projections = ['d', 'e', 'f']
      core2.wheres = ['g', 'h', 'i']
      core2.groups = ['j', 'k', 'l']
      core2.windows = ['m', 'n', 'o']
      core2.havings = ['p', 'q', 'r']

      expect(core2).toStrictEqual(core1)
    })

    test('inequality with different ivars', () => {
      const core1 = new SelectCore()
      core1.from = ['a', 'b', 'c']
      core1.projections = ['d', 'e', 'f']
      core1.wheres = ['g', 'h', 'i']
      core1.groups = ['j', 'k', 'l']
      core1.windows = ['m', 'n', 'o']
      core1.havings = ['p', 'q', 'r']

      const core2 = new SelectCore()
      core2.from = ['a', 'b', 'c']
      core2.projections = ['d', 'e', 'f']
      core2.wheres = ['g', 'h', 'i']
      core2.groups = ['j', 'k', 'l']
      core2.windows = ['m', 'n', 'o']
      core2.havings = ['l', 'o', 'l']

      expect(core2).not.toStrictEqual(core1)
    })
  })
})
