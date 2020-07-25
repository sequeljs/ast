import AliasPredication from '../mixins/AliasPredication'
import Expressions from '../mixins/Expressions'
import Math from '../mixins/Math'
import OrderPredications from '../mixins/OrderPredications'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import Attribute from './Attribute'

applyMixins(Attribute, [
  AliasPredication,
  Expressions,
  Math,
  OrderPredications,
  Predications,
  WhenPredication,
])

export default Attribute
