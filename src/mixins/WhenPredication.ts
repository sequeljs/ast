import Case from '../nodes/Case'
import buildQuoted from '../nodes/buildQuoted'

export default abstract class WhenPredication {
  when(other: any): Case {
    return new Case(this).when(buildQuoted(other, this))
  }
}
