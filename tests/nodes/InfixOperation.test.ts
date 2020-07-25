import '../helper'

import As from '../../src/nodes/As'
import Descending from '../../src/nodes/Descending'
import InfixOperation from '../../src/nodes/InfixOperation'
import SQLLiteral from '../../src/nodes/SQLLiteral'

describe('InfixOperation', () => {
  test('construct', () => {
    const operation = new InfixOperation('+', 1, 2)

    expect(operation.operator).toStrictEqual('+')
    expect(operation.left).toStrictEqual(1)
    expect(operation.right).toStrictEqual(2)
  })

  test('operation alias', () => {
    const operation = new InfixOperation('+', 1, 2)
    const alias = operation.as('zomg')

    expect(alias).toBeInstanceOf(As)

    expect(alias.left).toStrictEqual(operation)
    expect(alias.right).toStrictEqual(new SQLLiteral('zomg'))
  })

  test('operation ordering', () => {
    const operation = new InfixOperation('+', 1, 2)

    const ordering = operation.desc()

    expect(ordering).toBeInstanceOf(Descending)
    expect(ordering.expr).toStrictEqual(operation)
    expect(ordering.isDescending).toBeTruthy()
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [
        new InfixOperation('+', 1, 2),
        new InfixOperation('+', 1, 2),
      ]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [
        new InfixOperation('+', 1, 2),
        new InfixOperation('+', 1, 3),
      ]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
