import Unary from './Unary'

import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class Grouping extends Unary {}

interface Grouping extends Predications, WhenPredication {}

export default Grouping
