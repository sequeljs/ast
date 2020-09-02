import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import False from './False.js'

applyMixins(False, [AliasPredication])

export default False
