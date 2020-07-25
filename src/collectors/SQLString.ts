import type Binder from './Binder'
import type Collector from './Collector'

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

  compile(_: any): string {
    return this.str
  }
}
