import type Quoter from '../interfaces/Quoter'

import type Binder from './Binder'
import type Collector from './Collector'

export default class SubstituteBinds<T extends Collector<T['value']>>
  implements Collector<T['value']>
{
  protected readonly delegate: T

  protected readonly quoter: Quoter

  get value(): T['value'] {
    return this.delegate.value
  }

  constructor(quoter: Quoter, delegate: T) {
    this.delegate = delegate
    this.quoter = quoter
  }

  addBind(bind: string, _: Binder): SubstituteBinds<T> {
    return this.append(String(this.quoter.quote(bind)))
  }

  append(str: string): SubstituteBinds<T> {
    this.delegate.append(str)

    return this
  }
}
