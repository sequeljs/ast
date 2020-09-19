import InfixOperation from './InfixOperation.js'

export default class BitwiseAnd extends InfixOperation {
  constructor(left: any, right: any) {
    super('&', left, right)
  }
}
