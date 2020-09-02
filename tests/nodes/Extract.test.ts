import '../helper.js'

import Table from '../../src/Table.js'

describe('Extract', () => {
  test('should extract field', () => {
    const table = new Table('users')

    const node = table.get('timestamp').extract('date')

    expect(node.toSQL()).toStrictEqual(`EXTRACT(DATE FROM "users"."timestamp")`)
  })

  describe('as', () => {
    test('should alias the extract', () => {
      const table = new Table('users')

      const node = table.get('timestamp').extract('date').as('foo')

      expect(node.toSQL()).toStrictEqual(
        `EXTRACT(DATE FROM "users"."timestamp") AS foo`,
      )
    })

    test('should not mutate the extract', () => {
      const table = new Table('users')

      const extract = table.get('timestamp').extract('date')

      const before = { ...extract }

      extract.as('foo')

      expect(extract).toEqual(before)
    })
  })

  describe('equality', () => {
    test('equality with same ivars', () => {
      const table = new Table('users')

      const array = [
        table.get('attribute').extract('foo'),
        table.get('attribute').extract('foo'),
      ]

      expect(array[1]).toStrictEqual(array[0])
    })

    test('inequality with different ivars', () => {
      const table = new Table('users')

      const array = [
        table.get('attribute').extract('foo'),
        table.get('attribute').extract('bar'),
      ]

      expect(array[1]).not.toStrictEqual(array[0])
    })
  })
})
