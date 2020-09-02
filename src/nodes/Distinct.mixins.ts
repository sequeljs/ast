import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Distinct from './Distinct.js'

applyMixins(Distinct, [AliasPredication])

export default Distinct
