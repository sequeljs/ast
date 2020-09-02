import AliasPredication from '../mixins/AliasPredication.js'
import Expressions from '../mixins/Expressions.js'
import OrderPredications from '../mixins/OrderPredications.js'
import Predications from '../mixins/Predications.js'
import WhenPredication from '../mixins/WhenPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import SQLLiteral from './SQLLiteral.js'

applyMixins(SQLLiteral, [
  AliasPredication,
  Expressions,
  OrderPredications,
  Predications,
  WhenPredication,
])

export default SQLLiteral
