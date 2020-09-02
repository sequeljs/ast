import '../helper.js'

import Preceding from '../../src/nodes/Preceding.js'
import Range from '../../src/nodes/Range.js'

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
