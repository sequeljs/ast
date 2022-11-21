import ReversionPredication from '../mixins/ReversionPredication'
import applyMixins from '../mixins/applyMixins'

import Descending from './Descending'

applyMixins(Descending, [ReversionPredication])

export default Descending
