import StatementMethods from '../mixins/StatementMethods'
import applyMixins from '../mixins/applyMixins'

import DeleteManager from './DeleteManager'

applyMixins(DeleteManager, [StatementMethods])

export default DeleteManager
