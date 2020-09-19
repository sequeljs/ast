import Case from '../nodes/Case.js'
import buildQuoted from '../nodes/buildQuoted.js'

export default abstract class WhenPredication {
  when(other: any): Case {
    return new Case(this).when(buildQuoted(other, this))
  }
}
