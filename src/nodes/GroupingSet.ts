import Unary from './Unary'

import type GroupingElement from './GroupingElement'

import type Visitable from '../visitors/Visitable'

export default class GroupingSet extends Unary<GroupingElement | Visitable[]> {}
