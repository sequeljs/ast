import '../helper'

import Values from '../../src/nodes/Values'

describe('Values', () => {
  test('construct', () => {
    const node = new Values(['a', 'b'], ['c', 'd'])

    expect(node.expressions).toStrictEqual(['a', 'b'])
    expect(node.columns).toStrictEqual(['c', 'd'])
  })

  test('accepts attributes change', () => {
    const node = new Values(['a', 'b'], ['c', 'd'])

    node.expressions = ['w', 'x']
    node.columns = ['y', 'z']

    expect(node.left).toStrictEqual(['w', 'x'])
    expect(node.right).toStrictEqual(['y', 'z'])
  })
})
