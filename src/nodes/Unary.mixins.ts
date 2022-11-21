import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import Unary from './Unary'

applyMixins(Unary, [AliasPredication])

export default Unary
