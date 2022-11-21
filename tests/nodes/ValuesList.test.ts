import '../helper'

import ValuesList from '../../src/nodes/ValuesList'

describe('ValuesList', () => {
  test('construct', () => {
    const node = new ValuesList([
      ['a', 'b'],
      ['c', 'd'],
    ])

    expect(node.rows).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })

  test('accepts attributes change', () => {
    const node = new ValuesList([
      ['a', 'b'],
      ['c', 'd'],
    ])

    node.expr = [
      ['a', 'b'],
      ['c', 'd'],
    ]

    expect(node.rows).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })
})
