import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import True from './True.js'

applyMixins(True, [AliasPredication])

export default True
