import StatementMethods from '../mixins/StatementMethods.js'
import applyMixins from '../mixins/applyMixins.js'

import DeleteManager from './DeleteManager.js'

applyMixins(DeleteManager, [StatementMethods])

export default DeleteManager
