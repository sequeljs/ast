import '../helper'

import DeleteStatement from '../../src/nodes/DeleteStatement'

describe('DeleteStatement', () => {
  describe('equality', () => {
    test('equality with same ivars', () => {
      const statement1 = new DeleteStatement()
      statement1.wheres = ['a', 'b', 'c']

      const statement2 = new DeleteStatement()
      statement2.wheres = ['a', 'b', 'c']

      const array = [statement1, statement2]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const statement1 = new DeleteStatement()
      statement1.wheres = ['a', 'b', 'c']

      const statement2 = new DeleteStatement()
      statement2.wheres = ['1', '2', '3']

      const array = [statement1, statement2]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
