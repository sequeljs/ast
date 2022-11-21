import ReversionPredication from '../mixins/ReversionPredication'
import applyMixins from '../mixins/applyMixins'

import Ascending from './Ascending'

applyMixins(Ascending, [ReversionPredication])

export default Ascending
