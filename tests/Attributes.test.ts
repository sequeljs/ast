import './helper.js'

import AttributeBoolean from '../src/attributes/Boolean.js'
import AttributeDecimal from '../src/attributes/Decimal.js'
import AttributeFloat from '../src/attributes/Float.js'
import AttributeInteger from '../src/attributes/Integer.js'
import AttributeString from '../src/attributes/String.js'
import AttributeTime from '../src/attributes/Time.js'
import AttributeUndefined from '../src/attributes/Undefined.js'

import Table from '../src/Table.js'

import attributeFor from './support/attributeFor.js'

describe('Attributes', () => {
  test('responds to lower', () => {
    const relation = new Table('users')
    const attribute = relation.get('foo')
    const node = attribute.lower()

    expect(node.name).toStrictEqual('LOWER')
    expect(node.expressions).toStrictEqual([attribute])
  })

  describe('for', () => {
    test('deals with unknown column types', () => {
      expect(attributeFor({ type: 'crazy' })).toStrictEqual(AttributeUndefined)
    })

    test.each(['binary', 'string', 'text'])(
      'returns the correct constant for string',
      (type) => {
        expect(attributeFor({ type })).toStrictEqual(AttributeString)
      },
    )

    test('returns the correct constant for integer', () => {
      expect(attributeFor({ type: 'integer' })).toStrictEqual(AttributeInteger)
    })

    test('returns the correct constant for float', () => {
      expect(attributeFor({ type: 'float' })).toStrictEqual(AttributeFloat)
    })

    test('returns the correct constant for decimal', () => {
      expect(attributeFor({ type: 'decimal' })).toStrictEqual(AttributeDecimal)
    })

    test('returns the correct constant for boolean', () => {
      expect(attributeFor({ type: 'boolean' })).toStrictEqual(AttributeBoolean)
    })

    test.each(['date', 'datetime', 'time', 'timestamp'])(
      'returns the correct constant for time',
      (type) => {
        expect(attributeFor({ type })).toStrictEqual(AttributeTime)
      },
    )
  })
})
