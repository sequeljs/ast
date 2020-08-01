import Unary from './Unary'

import type Visitable from '../visitors/Visitable'

export default class OptimizerHints extends Unary<Visitable[]> {}
