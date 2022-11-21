import ConcatPredication from '../mixins/ConcatPredication'
import OrderPredications from '../mixins/OrderPredications'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import WindowPredication from '../mixins/WindowPredication'
import applyMixins from '../mixins/applyMixins'

import SQLFunction from './SQLFunction'

applyMixins(SQLFunction, [
  ConcatPredication,
  OrderPredications,
  Predications,
  WhenPredication,
  WindowPredication,
])

export default SQLFunction
