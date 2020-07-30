import Unary from './Unary'

import type AliasPredication from '../mixins/AliasPredication'
import type ConcatPredication from '../mixins/ConcatPredication'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class Extract extends Unary {
  public field: any

  constructor(expr: any, field: any) {
    super(expr)

    this.field = field
  }
}

interface Extract
  extends AliasPredication,
    ConcatPredication,
    Predications,
    WhenPredication {}

export default Extract
