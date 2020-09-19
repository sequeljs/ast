import StatementMethods from '../mixins/StatementMethods.js'
import applyMixins from '../mixins/applyMixins.js'

import UpdateManager from './UpdateManager.js'

applyMixins(UpdateManager, [StatementMethods])

export default UpdateManager
