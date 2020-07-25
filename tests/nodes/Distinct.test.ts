import '../helper'

import Distinct from '../../src/nodes/Distinct'
import Node from '../../src/nodes/Node'

describe('Distinct', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new Distinct(), new Distinct()]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with other nodes', () => {
      const array = [new Distinct(), new Node()]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
