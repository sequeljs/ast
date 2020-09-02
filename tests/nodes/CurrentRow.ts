import '../helper.js'

import CurrentRow from '../../src/nodes/CurrentRow.js'
import Node from '../../src/nodes/Node.js'

describe('CurrentRow', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new CurrentRow(), new CurrentRow()]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new CurrentRow(), new Node()]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
