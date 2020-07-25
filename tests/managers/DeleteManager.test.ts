import '../helper'

import DeleteManager from '../../src/managers/DeleteManager'

import Table from '../../src/Table'

describe('DeleteManager', () => {
  describe('from', () => {
    test('uses from', () => {
      const table = new Table('users')

      const dm = new DeleteManager()
      dm.from(table)

      expect(dm.toSQL()).toStrictEqual(`DELETE FROM "users"`)
    })

    test('chains', () => {
      const table = new Table('users')

      const dm = new DeleteManager()

      expect(dm.from(table)).toStrictEqual(dm)
    })
  })

  describe('limit', () => {
    test('handles limit properly', () => {
      const table = new Table('users')

      const dm = new DeleteManager()
      dm.take(10)
      dm.from(table)

      expect(dm.toSQL()).toStrictEqual(`DELETE FROM "users" LIMIT 10`)
    })

    test('noops on null', () => {
      const table = new Table('users')

      const dm = new DeleteManager()
      dm.take(null)
      dm.from(table)

      expect(dm.toSQL()).toStrictEqual(`DELETE FROM "users"`)
    })
  })

  describe('where', () => {
    it('uses where values', () => {
      const table = new Table('users')

      const dm = new DeleteManager()
      dm.from(table)
      dm.where(table.get('id').eq(10))

      expect(dm.toSQL()).toStrictEqual(
        `DELETE FROM "users" WHERE "users"."id" = 10`,
      )
    })

    it('chains', () => {
      const table = new Table('users')

      const dm = new DeleteManager()

      expect(dm.where(table.get('id').eq(10))).toStrictEqual(dm)
    })
  })
})
