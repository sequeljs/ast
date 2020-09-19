import Unary from './Unary.js'

import type GroupingElement from './GroupingElement.js'

import type Visitable from '../visitors/Visitable.js'

export default class Cube extends Unary<GroupingElement | Visitable[]> {}
