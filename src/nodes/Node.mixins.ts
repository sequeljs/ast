import FactoryMethods from '../mixins/FactoryMethods'
import NodeMethods from '../mixins/NodeMethods'
import applyMixins from '../mixins/applyMixins'

import Node from './Node'

applyMixins(Node, [FactoryMethods, NodeMethods])

export default Node
