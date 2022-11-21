import Equality from './Equality'

import type Visitable from '../visitors/Visitable'

export default class In extends Equality<any, Visitable | Visitable[]> {}
