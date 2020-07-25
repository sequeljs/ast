import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import Grouping from './Grouping'

applyMixins(Grouping, [Predications, WhenPredication])

export default Grouping
