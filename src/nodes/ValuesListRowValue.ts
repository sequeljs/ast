/** @internal */ /** */

import type BindParam from './BindParam'
import type SQLLiteral from './SQLLiteral'

type ValuesListRowValue = number | string | BindParam | SQLLiteral

export default ValuesListRowValue
