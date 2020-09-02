import FactoryMethods from '../mixins/FactoryMethods.js'
import applyMixins from '../mixins/applyMixins.js'

import TreeManager from './TreeManager.js'

applyMixins(TreeManager, [FactoryMethods])

export default TreeManager
