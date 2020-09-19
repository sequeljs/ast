import Equality from './Equality.js'

import type Visitable from '../visitors/Visitable.js'

export default class In extends Equality<any, Visitable | Visitable[]> {}
