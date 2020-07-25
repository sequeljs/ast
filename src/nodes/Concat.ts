import InfixOperation from './InfixOperation'

export default class Concat extends InfixOperation {
  constructor(left: any, right: any) {
    super('||', left, right)
  }
}
