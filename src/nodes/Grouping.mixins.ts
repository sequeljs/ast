import ConcatPredication from '../mixins/ConcatPredication'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import Grouping from './Grouping'

applyMixins(Grouping, [ConcatPredication, Predications, WhenPredication])

export default Grouping
