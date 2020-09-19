import Binary from './Binary.js'

import type Visitable from '../visitors/Visitable.js'

export default class NotIn extends Binary<any, Visitable | Visitable[]> {}
