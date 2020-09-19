import Binary from './Binary.js'
import buildQuoted from './buildQuoted.js'

export default class Matches extends Binary {
  public caseSensitive: boolean

  public readonly escape: any

  constructor(
    left: any,
    right: any,
    escape: any = null,
    caseSensitive = false,
  ) {
    super(left, right)

    this.caseSensitive = caseSensitive
    this.escape = escape && buildQuoted(escape)
  }
}
