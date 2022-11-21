import FactoryMethods from '../mixins/FactoryMethods'
import applyMixins from '../mixins/applyMixins'

import TreeManager from './TreeManager'

applyMixins(TreeManager, [FactoryMethods])

export default TreeManager
