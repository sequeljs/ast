import '../helper'

import Preceding from '../../src/nodes/Preceding'
import Range from '../../src/nodes/Range'

describe('Range', () => {
  test('construct', () => {
    const node = new Range()

    expect(node.expr).toBeNull()
  })

  test('construct with expression', () => {
    const expr = new Preceding()

    const node = new Range(expr)

    expect(node.expr).toStrictEqual(expr)
  })
})
