import type Relation from '../interfaces/Relation.js'

import type AliasPredication from '../mixins/AliasPredication.js'
import type ConcatPredication from '../mixins/ConcatPredication.js'
import type Expressions from '../mixins/Expressions.js'
import type Math from '../mixins/Math.js'
import type OrderPredications from '../mixins/OrderPredications.js'
import type Predications from '../mixins/Predications.js'
import type WhenPredication from '../mixins/WhenPredication.js'

import type NamedSQLFunction from '../nodes/NamedSQLFunction.js'
import type SQLLiteral from '../nodes/SQLLiteral.js'

import type Visitable from '../visitors/Visitable.js'

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
