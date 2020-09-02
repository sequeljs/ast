import '../helper.js'

import FactoryMethods from '../../src/mixins/FactoryMethods.js'
import applyMixins from '../../src/mixins/applyMixins.js'

import False from '../../src/nodes/False.js'
import Join from '../../src/nodes/Join.js'
import NamedSQLFunction from '../../src/nodes/NamedSQLFunction.js'
import On from '../../src/nodes/On.js'
import True from '../../src/nodes/True.js'

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
