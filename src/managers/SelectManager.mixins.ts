import CRUD from '../mixins/CRUD'
import applyMixins from '../mixins/applyMixins'

import SelectManager from './SelectManager'

applyMixins(SelectManager, [CRUD])

export default SelectManager
