import ReversionPredication from '../mixins/ReversionPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Ascending from './Ascending.js'

applyMixins(Ascending, [ReversionPredication])

export default Ascending
