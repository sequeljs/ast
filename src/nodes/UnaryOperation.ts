import Unary from './Unary'

import type Attribute from '../attributes/Attribute'

import type AliasPredication from '../mixins/AliasPredication'
import type Expressions from '../mixins/Expressions'
import type Math from '../mixins/Math'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class UnaryOperation extends Unary {
  public readonly operator: string

  constructor(operator: string, operand: number | string | Attribute) {
    super(operand)

    this.operator = operator
  }
}

interface UnaryOperation
  extends AliasPredication,
    Expressions,
    Math,
    OrderPredications,
    Predications,
    WhenPredication {}

export default UnaryOperation
