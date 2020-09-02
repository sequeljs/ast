/** @internal */ /** */

import type Visitable from './Visitable.js'

type VisitFunction<T> = (thing: Visitable | Visitable[] | null, col: T) => T

export default VisitFunction
