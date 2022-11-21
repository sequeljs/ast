import AliasPredication from '../mixins/AliasPredication'
import applyMixins from '../mixins/applyMixins'

import Case from './Case'

applyMixins(Case, [AliasPredication])

export default Case
