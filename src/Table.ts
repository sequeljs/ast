import Attribute from './attributes/Attribute'

import SQLLiteral from './nodes/SQLLiteral'
import TableAlias from './nodes/TableAlias'

import type TypeCaster from './interfaces/TypeCaster'

import type CRUD from './mixins/CRUD'
import type FactoryMethods from './mixins/FactoryMethods'
import type SelectPredications from './mixins/SelectPredications'

import type Visitable from './visitors/Visitable'

class Table implements TypeCaster {
  public name: string

  public tableAlias: TableAlias | string | null

  protected typeCaster: TypeCaster

  get tableName(): string {
    return this.name
  }

  constructor(
    name: string,
    as: TableAlias | string | null = null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeCaster: any = null,
  ) {
    this.name = name
    this.typeCaster = typeCaster

    let tableAlias: TableAlias | string | null = as
    if (as === name || (as instanceof TableAlias && as.name === name)) {
      tableAlias = null
    }

    this.tableAlias = tableAlias
  }

  alias(name: string | null = null): TableAlias {
    return new TableAlias(this, name ?? `${this.name}_2`)
  }

  get(name: string | SQLLiteral): Attribute {
    return new Attribute(this, name)
  }

  /* TypeCaster */
  isAbleToTypeCast(): boolean {
    return !!this.typeCaster
  }

  typeCastForDatabase(
    attributeName: string | SQLLiteral,
    value: Visitable,
  ): number | string {
    return this.typeCaster.typeCastForDatabase(attributeName, value)
  }
}

interface Table extends CRUD, FactoryMethods, SelectPredications {}

export default Table
