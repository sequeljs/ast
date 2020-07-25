import AliasPredication from '../mixins/AliasPredication'
import Expressions from '../mixins/Expressions'
import OrderPredications from '../mixins/OrderPredications'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import SQLLiteral from './SQLLiteral'

applyMixins(SQLLiteral, [
  AliasPredication,
  Expressions,
  OrderPredications,
  Predications,
  WhenPredication,
])

export default SQLLiteral
