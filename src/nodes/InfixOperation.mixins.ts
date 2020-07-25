import AliasPredication from '../mixins/AliasPredication'
import Expressions from '../mixins/Expressions'
import Math from '../mixins/Math'
import OrderPredications from '../mixins/OrderPredications'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import InfixOperation from './InfixOperation'

applyMixins(InfixOperation, [
  AliasPredication,
  Expressions,
  Math,
  OrderPredications,
  Predications,
  WhenPredication,
])

export default InfixOperation
