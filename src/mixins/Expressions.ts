import Avg from '../nodes/Avg'
import Count from '../nodes/Count'
import Extract from '../nodes/Extract'
import Max from '../nodes/Max'
import Min from '../nodes/Min'
import Sum from '../nodes/Sum'

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
