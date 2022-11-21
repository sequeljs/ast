import Window from './Window'

export default class NamedWindow extends Window {
  public name: any

  constructor(name: any) {
    super()

    this.name = name
  }
}
