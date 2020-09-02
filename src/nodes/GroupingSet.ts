import Unary from './Unary.js'

import type GroupingElement from './GroupingElement.js'

import type Visitable from '../visitors/Visitable.js'

export default class GroupingSet extends Unary<GroupingElement | Visitable[]> {}
