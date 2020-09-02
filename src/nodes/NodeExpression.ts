import Node from './Node.js'

import type ConcatPredication from '../mixins/ConcatPredication.js'
import type Expressions from '../mixins/Expressions.js'
import type Math from '../mixins/Math.js'
import type OrderPredications from '../mixins/OrderPredications.js'
import type Predications from '../mixins/Predications.js'
import type WhenPredication from '../mixins/WhenPredication.js'

class NodeExpression extends Node {}

interface NodeExpression
  extends ConcatPredication,
    Expressions,
    Math,
    OrderPredications,
    Predications,
    WhenPredication {}

export default NodeExpression
