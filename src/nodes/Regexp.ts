import Binary from './Binary'

export default class Regexp extends Binary {
  public caseSensitive: boolean

  constructor(left: any, right: any, caseSensitive = true) {
    super(left, right)

    this.caseSensitive = caseSensitive
  }
}
