import AliasPredication from '../mixins/AliasPredication.js'
import ConcatPredication from '../mixins/ConcatPredication.js'
import Expressions from '../mixins/Expressions.js'
import Math from '../mixins/Math.js'
import OrderPredications from '../mixins/OrderPredications.js'
import Predications from '../mixins/Predications.js'
import WhenPredication from '../mixins/WhenPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Attribute from './Attribute.js'

applyMixins(Attribute, [
  AliasPredication,
  ConcatPredication,
  Expressions,
  Math,
  OrderPredications,
  Predications,
  WhenPredication,
])

export default Attribute
