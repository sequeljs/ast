import '../helper'

import Matches from '../../src/nodes/Matches'
import buildQuoted from '../../src/nodes/buildQuoted'

import Table from '../../src/Table'

describe('Matches', () => {
  test('construct', () => {
    const relation = new Table('users')

    const node = buildQuoted('foo%')

    const matches = new Matches(relation, node)

    expect(matches.left).toStrictEqual(relation)
    expect(matches.right).toStrictEqual(node)
  })
})
