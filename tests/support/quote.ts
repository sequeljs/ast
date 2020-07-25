/* eslint-disable @typescript-eslint/ban-types */
export function quote(
  thing: boolean | number | string | Date | Function | null,
): number | string {
  if (typeof thing === 'boolean') {
    return thing ? "'t'" : "'f'"
  }

  if (typeof thing === 'function') {
    return `'${thing.name}'`
  }

  if (typeof thing === 'bigint') {
    return thing
  }

  if (typeof thing === 'number') {
    return thing
  }

  if (thing instanceof Date) {
    return `'${thing.toISOString().replace(/T/, ' ').replace(/\..+/, '')}'`
  }

  if (thing === null) {
    return 'NULL'
  }

  return `'${String(thing).replace(/'/g, "\\\\'")}'`
}
/* eslint-enable @typescript-eslint/ban-types */

export function quoteColumnName(name: string): string {
  return `"${name}"`
}

export function quoteTableName(name: string): string {
  return `"${name}"`
}
