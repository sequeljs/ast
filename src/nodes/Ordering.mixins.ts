import NullsFirstPredication from '../mixins/NullsFirstPredication.js'
import NullsLastPredication from '../mixins/NullsLastPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Ordering from './Ordering.js'

applyMixins(Ordering, [NullsFirstPredication, NullsLastPredication])

export default Ordering
