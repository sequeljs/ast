import type SQLLiteral from '../nodes/SQLLiteral'

type VisitableLiteral = bigint | number | SQLLiteral

export default VisitableLiteral
