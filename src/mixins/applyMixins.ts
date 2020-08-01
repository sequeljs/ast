export default function applyMixins(derivedCtor: any, baseCtors: any[]): void {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype)
      .filter((name) => name !== 'constructor')
      .forEach((name) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(
          baseCtor.prototype,
          name,
        )

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.defineProperty(derivedCtor.prototype, name, propertyDescriptor!)
      })
  })
}
