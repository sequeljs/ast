import CRUD from '../mixins/CRUD.js'
import applyMixins from '../mixins/applyMixins.js'

import SelectManager from './SelectManager.js'

applyMixins(SelectManager, [CRUD])

export default SelectManager
