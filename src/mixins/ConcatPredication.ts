import Concat from '../nodes/Concat'

export default abstract class ConcatPredication {
  concat(other: any): Concat {
    return new Concat(this, other)
  }
}
