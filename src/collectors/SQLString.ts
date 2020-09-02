import type Binder from './Binder.js'
import type Collector from './Collector.js'

export default class SQLString implements Collector<string> {
  private bindIndex = 1

  private str = ''

  get value(): string {
    return this.str
  }

  addBind(_: string, binder: Binder): SQLString {
    this.append(binder(this.bindIndex))
    this.bindIndex += 1

    return this
  }

  append(str: string): SQLString {
    this.str = this.str.concat(str)

    return this
  }
}
