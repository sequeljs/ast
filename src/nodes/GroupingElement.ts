import Unary from './Unary'

import type Visitable from '../visitors/Visitable'

export default class GroupingElement extends Unary<Visitable | Visitable[]> {}
