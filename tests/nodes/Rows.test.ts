import '../helper.js'

import Preceding from '../../src/nodes/Preceding.js'
import Rows from '../../src/nodes/Rows.js'

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
