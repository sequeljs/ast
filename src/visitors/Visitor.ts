import Attribute from '../attributes/Attribute'

import VisitorError from '../errors/VisitorError'

import type Collector from '../collectors/Collector'

import type VisitFunction from './VisitFunction'
import type Visitable from './Visitable'

export default abstract class Visitor {
  accept<T extends Collector<T['value']>>(
    object: Visitable | Visitable[] | null,
    collector: T,
  ): T {
    return this.visit(object, collector)
  }

  visit<T extends Collector<T['value']>>(
    object: Visitable | Visitable[] | null,
    collector: T,
  ): T {
    let objectType: string
    if (object === null) {
      objectType = 'Null'
    } else if (typeof object === 'bigint') {
      objectType = 'BigInt'
    } else if (typeof object === 'boolean') {
      objectType = 'Boolean'
    } else if (typeof object === 'number') {
      objectType = 'Number'
    } else if (typeof object === 'string') {
      objectType = 'String'
    } else if (typeof object === 'symbol') {
      objectType = 'Symbol'
    } else if (object instanceof Attribute) {
      objectType = `Attributes${object.constructor.name}`
    } else {
      let prototype: { name: string } = object.constructor
      objectType = prototype.name

      while (
        !(`visit${objectType}` in this.constructor.prototype) &&
        objectType !== ''
      ) {
        prototype = Object.getPrototypeOf(prototype)
        objectType = prototype.name
      }
    }

    if (
      objectType !== '' &&
      `visit${objectType}` in this.constructor.prototype
    ) {
      const visitFunction: VisitFunction<T> = this.constructor.prototype[
        `visit${objectType}`
      ].bind(this)

      return visitFunction(object, collector) as T
    }

    throw new VisitorError(`Cannot visit ${objectType}`)
  }
}
