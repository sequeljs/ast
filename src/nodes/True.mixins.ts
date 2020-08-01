import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import True from './True'

applyMixins(True, [AliasPredication])

export default True
