import Unary from './Unary'

import type NullsFirstPredication from '../mixins/NullsFirstPredication'
import type NullsLastPredication from '../mixins/NullsLastPredication'

class Ordering extends Unary {}

interface Ordering extends NullsFirstPredication, NullsLastPredication {}

export default Ordering
