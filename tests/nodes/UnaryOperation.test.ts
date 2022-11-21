import '../helper'

import As from '../../src/nodes/As'
import Descending from '../../src/nodes/Descending'
import SQLLiteral from '../../src/nodes/SQLLiteral'
import UnaryOperation from '../../src/nodes/UnaryOperation'

describe('UnaryOperation', () => {
  test('construct', () => {
    const operation = new UnaryOperation('-', 1)

    expect(operation.operator).toStrictEqual('-')
    expect(operation.expr).toStrictEqual(1)
  })

  test('operation alias', () => {
    const operation = new UnaryOperation('-', 1)
    const alias = operation.as('zomg')

    expect(alias).toBeInstanceOf(As)

    expect(alias.left).toStrictEqual(operation)
    expect(alias.right).toStrictEqual(new SQLLiteral('zomg'))
  })

  test('operation ordering', () => {
    const operation = new UnaryOperation('+', 1)

    const ordering = operation.desc()

    expect(ordering).toBeInstanceOf(Descending)
    expect(ordering.expr).toStrictEqual(operation)
    expect(ordering.isDescending).toBeTruthy()
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const array = [new UnaryOperation('+', 1), new UnaryOperation('+', 1)]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const array = [new UnaryOperation('+', 1), new UnaryOperation('+', 2)]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
