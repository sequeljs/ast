import '../helper'

import BindParam from '../../src/nodes/BindParam'
import Node from '../../src/nodes/Node'

describe('BindParam', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new BindParam(1), new BindParam(1)]

      expect(array[1]).toStrictEqual(array[0])

      const array2 = [new BindParam('foo'), new BindParam('foo')]

      expect(array2[1]).toStrictEqual(array2[0])
    })

    test('inequality with different ivars', () => {
      const array = [new BindParam(1), new BindParam(2)]

      expect(array[1]).not.toStrictEqual(array[0])
    })

    test('inequality with other nodes', () => {
      const array = [new BindParam(null), new Node()]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
