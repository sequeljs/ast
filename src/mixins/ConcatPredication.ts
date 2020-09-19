import Concat from '../nodes/Concat.js'

export default abstract class ConcatPredication {
  concat(other: any): Concat {
    return new Concat(this, other)
  }
}
