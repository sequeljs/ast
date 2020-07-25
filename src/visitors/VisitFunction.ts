import type Visitable from './Visitable'

type VisitFunction<T> = (thing: Visitable | Visitable[] | null, col: T) => T

export default VisitFunction
