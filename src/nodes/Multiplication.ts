import InfixOperation from './InfixOperation'

export default class Multiplication extends InfixOperation {
  constructor(left: any, right: any) {
    super('*', left, right)
  }
}
