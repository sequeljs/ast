import type Binder from './Binder.js'
import type Collector from './Collector.js'

export default class Bind implements Collector<string[]> {
  private strBinds: string[] = []

  get value(): string[] {
    return this.strBinds
  }

  addBind(bind: string, _: Binder | null): Bind {
    this.strBinds.push(bind)

    return this
  }

  append(_: string): Bind {
    return this
  }
}
