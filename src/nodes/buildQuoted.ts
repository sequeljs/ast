/** @internal */ /** */

import Attribute from '../attributes/Attribute.js'

import SelectManager from '../managers/SelectManager.js'

import Table from '../Table.js'

import Casted from './Casted.js'
import Node from './Node.js'
import Quoted from './Quoted.js'
import SQLLiteral from './SQLLiteral.js'

function buildQuoted(other: Attribute, attribute: any): Attribute
function buildQuoted(other: Node, attribute: any): Node
function buildQuoted(other: Quoted, attribute: any): Quoted
function buildQuoted(other: SQLLiteral, attribute: any): SQLLiteral
function buildQuoted(other: SelectManager, attribute: any): SelectManager
function buildQuoted(other: Table, attribute: any): Table
function buildQuoted(other: any, attribute: Attribute): Casted
function buildQuoted(other: any): Quoted
function buildQuoted(
  other: any,
  attribute: any = null,
): Attribute | Casted | Node | Quoted | SQLLiteral | SelectManager | Table {
  if (
    other instanceof Attribute ||
    other instanceof Node ||
    other instanceof SQLLiteral ||
    other instanceof SelectManager ||
    other instanceof Table
  ) {
    return other
  }

  if (attribute instanceof Attribute) {
    return new Casted(other, attribute)
  }

  return new Quoted(other)
}

export default buildQuoted
