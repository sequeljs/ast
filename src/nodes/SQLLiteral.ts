import String from './String.base.js'

import type AliasPredication from '../mixins/AliasPredication.js'
import type Expressions from '../mixins/Expressions.js'
import type OrderPredications from '../mixins/OrderPredications.js'
import type Predications from '../mixins/Predications.js'
import type WhenPredication from '../mixins/WhenPredication.js'

class SQLLiteral extends String {}

interface SQLLiteral
  extends AliasPredication,
    Expressions,
    OrderPredications,
    Predications,
    WhenPredication {}

export default SQLLiteral
