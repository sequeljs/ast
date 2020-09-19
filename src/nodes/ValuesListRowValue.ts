/** @internal */ /** */

import type BindParam from './BindParam.js'
import type SQLLiteral from './SQLLiteral.js'

type ValuesListRowValue = number | string | BindParam | SQLLiteral

export default ValuesListRowValue
