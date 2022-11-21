import NullsFirstPredication from '../mixins/NullsFirstPredication'
import NullsLastPredication from '../mixins/NullsLastPredication'
import applyMixins from '../mixins/applyMixins'

import Ordering from './Ordering'

applyMixins(Ordering, [NullsFirstPredication, NullsLastPredication])

export default Ordering
