import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Unary from './Unary.js'

applyMixins(Unary, [AliasPredication])

export default Unary
