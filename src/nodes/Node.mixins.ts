import FactoryMethods from '../mixins/FactoryMethods.js'
import NodeMethods from '../mixins/NodeMethods.js'
import applyMixins from '../mixins/applyMixins.js'

import Node from './Node.js'

applyMixins(Node, [FactoryMethods, NodeMethods])

export default Node
