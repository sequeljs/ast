import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Binary from './Binary.js'

applyMixins(Binary, [AliasPredication])

export default Binary
