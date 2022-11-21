import String from './String.base'

import type AliasPredication from '../mixins/AliasPredication'
import type Expressions from '../mixins/Expressions'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class SQLLiteral extends String {}

interface SQLLiteral
  extends AliasPredication,
    Expressions,
    OrderPredications,
    Predications,
    WhenPredication {}

export default SQLLiteral
