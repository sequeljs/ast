import InfixOperation from './InfixOperation'

export default class Division extends InfixOperation {
  constructor(left: any, right: any) {
    super('/', left, right)
  }
}
