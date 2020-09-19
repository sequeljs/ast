import Binary from './Binary.js'

import type AliasPredication from '../mixins/AliasPredication.js'
import type ConcatPredication from '../mixins/ConcatPredication.js'
import type Expressions from '../mixins/Expressions.js'
import type Math from '../mixins/Math.js'
import type OrderPredications from '../mixins/OrderPredications.js'
import type Predications from '../mixins/Predications.js'
import type WhenPredication from '../mixins/WhenPredication.js'

class InfixOperation extends Binary {
  public readonly operator: string

  constructor(operator: string, left: any, right: any) {
    super(left, right)

    this.operator = operator
  }
}

interface InfixOperation
  extends AliasPredication,
    ConcatPredication,
    Expressions,
    Math,
    OrderPredications,
    Predications,
    WhenPredication {}

export default InfixOperation
