import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import And from './And'

applyMixins(And, [AliasPredication])

export default And
