import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import SelectStatement from './SelectStatement.js'

applyMixins(SelectStatement, [AliasPredication])

export default SelectStatement
