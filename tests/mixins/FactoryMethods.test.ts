import '../helper'

import FactoryMethods from '../../src/mixins/FactoryMethods'
import applyMixins from '../../src/mixins/applyMixins'

import False from '../../src/nodes/False'
import Join from '../../src/nodes/Join'
import NamedSQLFunction from '../../src/nodes/NamedSQLFunction'
import On from '../../src/nodes/On'
import True from '../../src/nodes/True'

class Factory {}

interface Factory extends FactoryMethods {}

applyMixins(Factory, [FactoryMethods])

const scope = {
  factory: new Factory(),
}

describe('FactoryMethods', () => {
  test('createJoin', () => {
    const node = scope.factory.createJoin('one', 'two')

    expect(node).toBeInstanceOf(Join)
    expect(node.right).toStrictEqual('two')
  })

  test('createOn', () => {
    const node = scope.factory.createOn('one')

    expect(node).toBeInstanceOf(On)
    expect(node.expr).toStrictEqual('one')
  })

  test('createTrue', () => {
    const node = scope.factory.createTrue()

    expect(node).toBeInstanceOf(True)
  })

  test('createFalse', () => {
    const node = scope.factory.createFalse()

    expect(node).toBeInstanceOf(False)
  })

  test('lower', () => {
    const node = scope.factory.lower('one')

    expect(node).toBeInstanceOf(NamedSQLFunction)
    expect(node.name).toStrictEqual('LOWER')
    expect(node.expressions.map((e: any) => e.expr)).toStrictEqual(['one'])
  })

  test('coalesce', () => {
    const node = scope.factory.coalesce('one', 'two')

    expect(node).toBeInstanceOf(NamedSQLFunction)
    expect(node.name).toStrictEqual('COALESCE')
    expect(node.expressions).toStrictEqual(['one', 'two'])
  })
})
