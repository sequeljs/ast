import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import Distinct from './Distinct'

applyMixins(Distinct, [AliasPredication])

export default Distinct
