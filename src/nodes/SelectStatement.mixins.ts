import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import SelectStatement from './SelectStatement'

applyMixins(SelectStatement, [AliasPredication])

export default SelectStatement
