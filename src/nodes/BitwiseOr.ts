import InfixOperation from './InfixOperation.js'

export default class BitwiseOr extends InfixOperation {
  constructor(left: any, right: any) {
    super('|', left, right)
  }
}
