import InfixOperation from './InfixOperation'

export default class BitwiseAnd extends InfixOperation {
  constructor(left: any, right: any) {
    super('&', left, right)
  }
}
