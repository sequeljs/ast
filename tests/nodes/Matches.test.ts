import '../helper.js'

import Matches from '../../src/nodes/Matches.js'
import buildQuoted from '../../src/nodes/buildQuoted.js'

import Table from '../../src/Table.js'

describe('Matches', () => {
  test('construct', () => {
    const relation = new Table('users')

    const node = buildQuoted('foo%')

    const matches = new Matches(relation, node)

    expect(matches.left).toStrictEqual(relation)
    expect(matches.right).toStrictEqual(node)
  })
})
