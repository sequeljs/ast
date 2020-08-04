import type Relation from '../interfaces/Relation'

import type AliasPredication from '../mixins/AliasPredication'
import type ConcatPredication from '../mixins/ConcatPredication'
import type Expressions from '../mixins/Expressions'
import type Math from '../mixins/Math'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

import type NamedSQLFunction from '../nodes/NamedSQLFunction'
import type SQLLiteral from '../nodes/SQLLiteral'

import type Visitable from '../visitors/Visitable'

/**
 * @category Attributes
 */
class Attribute {
  public relation: Relation

  public name: string | SQLLiteral

  constructor(relation: Relation, name: string | SQLLiteral) {
    this.name = name
    this.relation = relation
  }

  isAbleToTypeCast(): boolean {
    return this.relation.isAbleToTypeCast()
  }

  lower(): NamedSQLFunction {
    return this.relation.lower(this)
  }

  typeCastForDatabase(value: Visitable): number | string {
    return this.relation.typeCastForDatabase(this.name, value)
  }
}

interface Attribute
  extends AliasPredication,
    ConcatPredication,
    Expressions,
    Math,
    OrderPredications,
    Predications,
    WhenPredication {}

export default Attribute
