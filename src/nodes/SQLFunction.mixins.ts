import ConcatPredication from '../mixins/ConcatPredication.js'
import OrderPredications from '../mixins/OrderPredications.js'
import Predications from '../mixins/Predications.js'
import WhenPredication from '../mixins/WhenPredication.js'
import WindowPredication from '../mixins/WindowPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import SQLFunction from './SQLFunction.js'

applyMixins(SQLFunction, [
  ConcatPredication,
  OrderPredications,
  Predications,
  WhenPredication,
  WindowPredication,
])

export default SQLFunction
