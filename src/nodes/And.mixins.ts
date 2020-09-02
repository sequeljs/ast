import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import And from './And.js'

applyMixins(And, [AliasPredication])

export default And
