import AliasPredication from '../mixins/AliasPredication'
import ConcatPredication from '../mixins/ConcatPredication'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import Extract from './Extract'

applyMixins(Extract, [
  AliasPredication,
  ConcatPredication,
  Predications,
  WhenPredication,
])

export default Extract
