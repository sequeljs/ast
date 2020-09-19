import Unary from './Unary.js'

import type Visitable from '../visitors/Visitable.js'

export default class OptimizerHints extends Unary<Visitable[]> {}
