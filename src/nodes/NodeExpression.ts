import Node from './Node'

import type ConcatPredication from '../mixins/ConcatPredication'
import type Expressions from '../mixins/Expressions'
import type Math from '../mixins/Math'
import type OrderPredications from '../mixins/OrderPredications'
import type Predications from '../mixins/Predications'
import type WhenPredication from '../mixins/WhenPredication'

class NodeExpression extends Node {}

interface NodeExpression
  extends ConcatPredication,
    Expressions,
    Math,
    OrderPredications,
    Predications,
    WhenPredication {}

export default NodeExpression
