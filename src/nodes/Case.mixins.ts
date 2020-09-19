import AliasPredication from '../mixins/AliasPredication.js'
import applyMixins from '../mixins/applyMixins.js'

import Case from './Case.js'

applyMixins(Case, [AliasPredication])

export default Case
