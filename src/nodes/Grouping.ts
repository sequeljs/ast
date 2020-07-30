import Unary from './Unary'

import type ConcatPredication from '../mixins/ConcatPredication'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class Grouping extends Unary {}

interface Grouping extends ConcatPredication, Predications, WhenPredication {}

export default Grouping
