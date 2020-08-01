import Binary from './Binary'

import type Visitable from '../visitors/Visitable'

export default class NotIn extends Binary<any, Visitable | Visitable[]> {}
