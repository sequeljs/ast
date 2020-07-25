import type AliasPredication from '../mixins/AliasPredication'
import type Expressions from '../mixins/Expressions'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class SQLLiteral {
  public value: string

  constructor(value: string | SQLLiteral) {
    if (value instanceof SQLLiteral) {
      this.value = value.value
    } else {
      this.value = value
    }
  }

  toString(): string {
    return this.value
  }
}

interface SQLLiteral
  extends AliasPredication,
    Expressions,
    OrderPredications,
    Predications,
    WhenPredication {}

export default SQLLiteral
