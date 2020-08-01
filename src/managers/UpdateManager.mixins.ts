import StatementMethods from '../mixins/StatementMethods'
import applyMixins from '../mixins/applyMixins'

import UpdateManager from './UpdateManager'

applyMixins(UpdateManager, [StatementMethods])

export default UpdateManager
