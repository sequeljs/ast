import type Binder from './Binder'

export default interface Collector<T = 'string'> {
  readonly value: T

  addBind(str: string, binder: Binder | null): Collector<T>

  append(str: string): Collector<T>
}
