import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Casted from './Casted.js'

applyMixins(Casted, [AliasPredication])

export default Casted
