import Avg from '../nodes/Avg.js'
import Count from '../nodes/Count.js'
import Extract from '../nodes/Extract.js'
import Max from '../nodes/Max.js'
import Min from '../nodes/Min.js'
import Sum from '../nodes/Sum.js'

export default abstract class Expressions {
  average(): Avg {
    return new Avg([this])
  }

  count(distinct = false): Count {
    return new Count([this], distinct)
  }

  extract(field: any): Extract {
    return new Extract([this], field)
  }

  maximum(): Max {
    return new Max([this])
  }

  minimum(): Min {
    return new Min([this])
  }

  sum(): Sum {
    return new Sum([this])
  }
}
