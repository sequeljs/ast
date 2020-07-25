import Math from '../mixins/Math'
import applyMixins from '../mixins/applyMixins'

import Count from './Count'

applyMixins(Count, [Math])

export default Count
