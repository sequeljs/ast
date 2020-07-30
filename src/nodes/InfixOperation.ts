import Binary from './Binary'

import type AliasPredication from '../mixins/AliasPredication'
import type ConcatPredication from '../mixins/ConcatPredication'
import type Expressions from '../mixins/Expressions'
import type Math from '../mixins/Math'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

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
