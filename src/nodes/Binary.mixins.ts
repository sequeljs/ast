import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import Binary from './Binary'

applyMixins(Binary, [AliasPredication])

export default Binary
