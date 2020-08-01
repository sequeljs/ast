import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import Casted from './Casted'

applyMixins(Casted, [AliasPredication])

export default Casted
