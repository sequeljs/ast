import '../helper.js'

import Case from '../../src/nodes/Case.js'
import Else from '../../src/nodes/Else.js'
import When from '../../src/nodes/When.js'
import buildQuoted from '../../src/nodes/buildQuoted.js'

describe('Case', () => {
  describe('construct', () => {
    test('sets case expression from first argument', () => {
      const node = new Case('foo')

      expect(node.case).toStrictEqual('foo')
    })

    test('sets default case from second argument', () => {
      const node = new Case(null, 'bar')

      expect(node.default).toStrictEqual('bar')
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const foo = buildQuoted('foo')
      const one = buildQuoted(1)
      const zero = buildQuoted(0)

      const case1 = new Case(foo)
      case1.conditions = [new When(foo, one)]
      case1.default = new Else(zero)

      const case2 = new Case(foo)
      case2.conditions = [new When(foo, one)]
      case2.default = new Else(zero)

      const array = [case1, case2]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const foo = buildQuoted('foo')
      const bar = buildQuoted('bar')
      const one = buildQuoted(1)
      const zero = buildQuoted(0)

      const case1 = new Case(foo)
      case1.conditions = [new When(foo, one)]
      case1.default = new Else(zero)

      const case2 = new Case(foo)
      case2.conditions = [new When(bar, one)]
      case2.default = new Else(zero)

      const array = [case1, case2]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
