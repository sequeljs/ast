import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import False from './False'

applyMixins(False, [AliasPredication])

export default False
