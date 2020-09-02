import ReversionPredication from '../mixins/ReversionPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Descending from './Descending.js'

applyMixins(Descending, [ReversionPredication])

export default Descending
