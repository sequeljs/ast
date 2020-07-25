import AliasPredication from '../mixins/AliasPredication'
import Predications from '../mixins/Predications'
import WhenPredication from '../mixins/WhenPredication'
import applyMixins from '../mixins/applyMixins'

import Extract from './Extract'

applyMixins(Extract, [AliasPredication, Predications, WhenPredication])

export default Extract
