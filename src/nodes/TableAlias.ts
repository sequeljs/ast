import Attribute from '../attributes/Attribute'

import Binary from './Binary'

import type Relation from '../interfaces/Relation'

import type Visitable from '../visitors/Visitable'

import type SQLLiteral from './SQLLiteral'

export default class TableAlias extends Binary {
  get name(): string | SQLLiteral {
    return this.right
  }

  set name(val: string | SQLLiteral) {
    this.right = val
  }

  get relation(): Relation {
    return this.left
  }

  set relation(val: Relation) {
    this.left = val
  }

  get tableAlias(): string | SQLLiteral {
    return this.name
  }

  set tableAlias(val: string | SQLLiteral) {
    this.name = val
  }

  get tableName(): string | SQLLiteral {
    return this.relation &&
      typeof this.relation === 'object' &&
      'name' in this.relation
      ? this.relation.name
      : this.name
  }

  get(name: string | SQLLiteral): Attribute {
    return new Attribute(this, name)
  }

  isAbleToTypeCast(): boolean {
    return (
      'isAbleToTypeCast' in this.relation && this.relation.isAbleToTypeCast()
    )
  }

  typeCastForDatabase(
    attributeName: string | SQLLiteral,
    value: Visitable,
  ): number | string {
    return this.relation.typeCastForDatabase(attributeName, value)
  }
}
