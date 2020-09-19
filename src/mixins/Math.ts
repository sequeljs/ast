import Addition from '../nodes/Addition.js'
import BitwiseAnd from '../nodes/BitwiseAnd.js'
import BitwiseNot from '../nodes/BitwiseNot.js'
import BitwiseOr from '../nodes/BitwiseOr.js'
import BitwiseShiftLeft from '../nodes/BitwiseShiftLeft.js'
import BitwiseShiftRight from '../nodes/BitwiseShiftRight.js'
import BitwiseXor from '../nodes/BitwiseXor.js'
import Division from '../nodes/Division.js'
import Grouping from '../nodes/Grouping.js'
import Multiplication from '../nodes/Multiplication.js'
import Subtraction from '../nodes/Subtraction.js'

export default abstract class Math {
  add(other: any): Grouping {
    return new Grouping(new Addition(this, other))
  }

  bitwiseAnd(other: any): Grouping {
    return new Grouping(new BitwiseAnd(this, other))
  }

  bitwiseNot(): BitwiseNot {
    return new BitwiseNot(this)
  }

  bitwiseOr(other: any): Grouping {
    return new Grouping(new BitwiseOr(this, other))
  }

  bitwiseShiftLeft(other: any): Grouping {
    return new Grouping(new BitwiseShiftLeft(this, other))
  }

  bitwiseShiftRight(other: any): Grouping {
    return new Grouping(new BitwiseShiftRight(this, other))
  }

  bitwiseXor(other: any): Grouping {
    return new Grouping(new BitwiseXor(this, other))
  }

  divide(other: any): Division {
    return new Division(this, other)
  }

  multiply(other: any): Multiplication {
    return new Multiplication(this, other)
  }

  subtract(other: any): Grouping {
    return new Grouping(new Subtraction(this, other))
  }
}
