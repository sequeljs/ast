import Unary from './Unary.js'

import type NullsFirstPredication from '../mixins/NullsFirstPredication.js'
import type NullsLastPredication from '../mixins/NullsLastPredication.js'

class Ordering extends Unary {}

interface Ordering extends NullsFirstPredication, NullsLastPredication {}

export default Ordering
