import Window from './Window.js'

export default class NamedWindow extends Window {
  public name: any

  constructor(name: any) {
    super()

    this.name = name
  }
}
