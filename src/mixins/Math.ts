import Addition from '../nodes/Addition'
import BitwiseAnd from '../nodes/BitwiseAnd'
import BitwiseNot from '../nodes/BitwiseNot'
import BitwiseOr from '../nodes/BitwiseOr'
import BitwiseShiftLeft from '../nodes/BitwiseShiftLeft'
import BitwiseShiftRight from '../nodes/BitwiseShiftRight'
import BitwiseXor from '../nodes/BitwiseXor'
import Division from '../nodes/Division'
import Grouping from '../nodes/Grouping'
import Multiplication from '../nodes/Multiplication'
import Subtraction from '../nodes/Subtraction'

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
