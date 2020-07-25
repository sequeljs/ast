import '../helper'

import Preceding from '../../src/nodes/Preceding'
import Rows from '../../src/nodes/Rows'

describe('Rows', () => {
  test('construct', () => {
    const node = new Rows()

    expect(node.expr).toBeNull()
  })

  test('construct with expression', () => {
    const expr = new Preceding()

    const node = new Rows(expr)

    expect(node.expr).toStrictEqual(expr)
  })
})
