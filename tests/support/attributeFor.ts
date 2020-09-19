import Boolean from '../../src/attributes/Boolean.js'
import Decimal from '../../src/attributes/Decimal.js'
import Float from '../../src/attributes/Float.js'
import Integer from '../../src/attributes/Integer.js'
import String from '../../src/attributes/String.js'
import Time from '../../src/attributes/Time.js'
import Undefined from '../../src/attributes/Undefined.js'

type AttributeType =
  | typeof Boolean
  | typeof Decimal
  | typeof Float
  | typeof Integer
  | typeof String
  | typeof Time
  | typeof Undefined

type Column<T> = {
  [key: string]: any
  type: T
}

function attributeFor(column: Column<'binary'>): typeof String
function attributeFor(column: Column<'boolean'>): typeof Boolean
function attributeFor(column: Column<'date'>): typeof Time
function attributeFor(column: Column<'datetime'>): typeof Time
function attributeFor(column: Column<'decimal'>): typeof Decimal
function attributeFor(column: Column<'float'>): typeof Float
function attributeFor(column: Column<'integer'>): typeof Integer
function attributeFor(column: Column<'string'>): typeof String
function attributeFor(column: Column<'text'>): typeof String
function attributeFor(column: Column<'time'>): typeof Time
function attributeFor(column: Column<'timestamp'>): typeof Time
function attributeFor(column: Column<string>): typeof Undefined
function attributeFor(column: Column<string>): AttributeType {
  switch (column.type) {
    case 'binary':
      return String
    case 'boolean':
      return Boolean
    case 'date':
      return Time
    case 'datetime':
      return Time
    case 'decimal':
      return Decimal
    case 'float':
      return Float
    case 'integer':
      return Integer
    case 'string':
      return String
    case 'text':
      return String
    case 'time':
      return Time
    case 'timestamp':
      return Time
    default:
      return Undefined
  }
}

export default attributeFor
