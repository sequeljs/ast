import type Binder from './Binder'
import type Collector from './Collector'

export default class Composite<
  L extends Collector<L['value']>,
  R extends Collector<R['value']>
> implements Collector<[L['value'], R['value']]> {
  protected readonly left: L

  protected readonly right: R

  get value(): [L['value'], L['value']] {
    return [this.left.value, this.right.value]
  }

  constructor(left: L, right: R) {
    this.left = left
    this.right = right
  }

  addBind(bind: string, binder: Binder | null): Composite<L, R> {
    this.left.addBind(bind, binder)
    this.right.addBind(bind, binder)

    return this
  }

  append(str: string): Composite<L, R> {
    this.left.append(str)
    this.right.append(str)

    return this
  }
}
