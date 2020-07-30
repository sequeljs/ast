import AliasPredication from '../mixins/AliasPredication'
import ConcatPredication from '../mixins/ConcatPredication'
import OrderPredications from '../mixins/OrderPredications'
import Predications from '../mixins/Predications'
import applyMixins from '../mixins/applyMixins'

import Case from './Case'

applyMixins(Case, [
  AliasPredication,
  ConcatPredication,
  OrderPredications,
  Predications,
])

export default Case
