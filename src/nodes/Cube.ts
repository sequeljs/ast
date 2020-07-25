import Unary from './Unary'

import type GroupingElement from './GroupingElement'

import type Visitable from '../visitors/Visitable'

export default class Cube extends Unary<GroupingElement | Visitable[]> {}
