import '../helper'

import UnqualifiedColumn from '../../src/nodes/UnqualifiedColumn'

import Table from '../../src/Table'

describe('UnqualifiedColumn', () => {
  test('construct', () => {
    const relation = new Table('users')

    const attr = relation.get('id')

    const node = new UnqualifiedColumn(attr)

    expect(node.expr).toStrictEqual(attr)
    expect(node.attribute).toStrictEqual(attr)
    expect(node.column).toStrictEqual('id')
    expect(node.name).toStrictEqual('id')
    expect(node.relation).toStrictEqual(relation)
  })

  test('accepts attribute change', () => {
    const relation = new Table('users')

    const attr1 = relation.get('foo')
    const attr2 = relation.get('bar')

    const node = new UnqualifiedColumn(attr1)

    expect(node.name).toStrictEqual('foo')

    node.attribute = attr2

    expect(node.name).toStrictEqual('bar')
  })
})
