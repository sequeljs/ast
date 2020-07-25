import * as mod from '../../src/nodes/mod'
import Addition from '../../src/nodes/Addition'
import And from '../../src/nodes/And'
import As from '../../src/nodes/As'
import Ascending from '../../src/nodes/Ascending'
import Assignment from '../../src/nodes/Assignment'
import Avg from '../../src/nodes/Avg'
import Between from '../../src/nodes/Between'
import Bin from '../../src/nodes/Bin'
import Binary from '../../src/nodes/Binary'
import BindParam from '../../src/nodes/BindParam'
import BitwiseAnd from '../../src/nodes/BitwiseAnd'
import BitwiseNot from '../../src/nodes/BitwiseNot'
import BitwiseOr from '../../src/nodes/BitwiseOr'
import BitwiseShiftLeft from '../../src/nodes/BitwiseShiftLeft'
import BitwiseShiftRight from '../../src/nodes/BitwiseShiftRight'
import BitwiseXor from '../../src/nodes/BitwiseXor'
import Case from '../../src/nodes/Case'
import Casted from '../../src/nodes/Casted'
import Concat from '../../src/nodes/Concat'
import Count from '../../src/nodes/Count'
import Cube from '../../src/nodes/Cube'
import CurrentRow from '../../src/nodes/CurrentRow'
import DeleteStatement from '../../src/nodes/DeleteStatement'
import Descending from '../../src/nodes/Descending'
import Distinct from '../../src/nodes/Distinct'
import DistinctOn from '../../src/nodes/DistinctOn'
import Division from '../../src/nodes/Division'
import DoesNotMatch from '../../src/nodes/DoesNotMatch'
import Else from '../../src/nodes/Else'
import Equality from '../../src/nodes/Equality'
import Except from '../../src/nodes/Except'
import Exists from '../../src/nodes/Exists'
import Extract from '../../src/nodes/Extract'
import False from '../../src/nodes/False'
import Following from '../../src/nodes/Following'
import FullOuterJoin from '../../src/nodes/FullOuterJoin'
import GreaterThan from '../../src/nodes/GreaterThan'
import GreaterThanOrEqual from '../../src/nodes/GreaterThanOrEqual'
import Group from '../../src/nodes/Group'
import Grouping from '../../src/nodes/Grouping'
import GroupingElement from '../../src/nodes/GroupingElement'
import GroupingSet from '../../src/nodes/GroupingSet'
import In from '../../src/nodes/In'
import InfixOperation from '../../src/nodes/InfixOperation'
import InnerJoin from '../../src/nodes/InnerJoin'
import InsertStatement from '../../src/nodes/InsertStatement'
import Intersect from '../../src/nodes/Intersect'
import Join from '../../src/nodes/Join'
import JoinSource from '../../src/nodes/JoinSource'
import LessThan from '../../src/nodes/LessThan'
import LessThanOrEqual from '../../src/nodes/LessThanOrEqual'
import Limit from '../../src/nodes/Limit'
import Lock from '../../src/nodes/Lock'
import Matches from '../../src/nodes/Matches'
import Max from '../../src/nodes/Max'
import Min from '../../src/nodes/Min'
import Multiplication from '../../src/nodes/Multiplication'
import NamedSQLFunction from '../../src/nodes/NamedSQLFunction'
import NamedWindow from '../../src/nodes/NamedWindow'
import Node from '../../src/nodes/Node'
import Not from '../../src/nodes/Not'
import NotEqual from '../../src/nodes/NotEqual'
import NotIn from '../../src/nodes/NotIn'
import NotRegexp from '../../src/nodes/NotRegexp'
import Offset from '../../src/nodes/Offset'
import On from '../../src/nodes/On'
import Or from '../../src/nodes/Or'
import Ordering from '../../src/nodes/Ordering'
import OuterJoin from '../../src/nodes/OuterJoin'
import Over from '../../src/nodes/Over'
import Preceding from '../../src/nodes/Preceding'
import Quoted from '../../src/nodes/Quoted'
import Range from '../../src/nodes/Range'
import Regexp from '../../src/nodes/Regexp'
import RightOuterJoin from '../../src/nodes/RightOuterJoin'
import RollUp from '../../src/nodes/RollUp'
import Rows from '../../src/nodes/Rows'
import SQLFunction from '../../src/nodes/SQLFunction'
import SQLLiteral from '../../src/nodes/SQLLiteral'
import SelectCore from '../../src/nodes/SelectCore'
import SelectStatement from '../../src/nodes/SelectStatement'
import StringJoin from '../../src/nodes/StringJoin'
import Subtraction from '../../src/nodes/Subtraction'
import Sum from '../../src/nodes/Sum'
import TableAlias from '../../src/nodes/TableAlias'
import Top from '../../src/nodes/Top'
import True from '../../src/nodes/True'
import Unary from '../../src/nodes/Unary'
import UnaryOperation from '../../src/nodes/UnaryOperation'
import Union from '../../src/nodes/Union'
import UnionAll from '../../src/nodes/UnionAll'
import UnqualifiedColumn from '../../src/nodes/UnqualifiedColumn'
import UpdateStatement from '../../src/nodes/UpdateStatement'
import Values from '../../src/nodes/Values'
import ValuesList from '../../src/nodes/ValuesList'
import When from '../../src/nodes/When'
import Window from '../../src/nodes/Window'
import With from '../../src/nodes/With'
import WithRecursive from '../../src/nodes/WithRecursive'

test('exports from module', () => {
  expect(mod.Addition).toStrictEqual(Addition)
  expect(mod.And).toStrictEqual(And)
  expect(mod.As).toStrictEqual(As)
  expect(mod.Ascending).toStrictEqual(Ascending)
  expect(mod.Assignment).toStrictEqual(Assignment)
  expect(mod.Avg).toStrictEqual(Avg)
  expect(mod.Between).toStrictEqual(Between)
  expect(mod.Bin).toStrictEqual(Bin)
  expect(mod.Binary).toStrictEqual(Binary)
  expect(mod.BindParam).toStrictEqual(BindParam)
  expect(mod.BitwiseAnd).toStrictEqual(BitwiseAnd)
  expect(mod.BitwiseNot).toStrictEqual(BitwiseNot)
  expect(mod.BitwiseOr).toStrictEqual(BitwiseOr)
  expect(mod.BitwiseShiftLeft).toStrictEqual(BitwiseShiftLeft)
  expect(mod.BitwiseShiftRight).toStrictEqual(BitwiseShiftRight)
  expect(mod.BitwiseXor).toStrictEqual(BitwiseXor)
  expect(mod.Case).toStrictEqual(Case)
  expect(mod.Casted).toStrictEqual(Casted)
  expect(mod.Concat).toStrictEqual(Concat)
  expect(mod.Count).toStrictEqual(Count)
  expect(mod.Cube).toStrictEqual(Cube)
  expect(mod.CurrentRow).toStrictEqual(CurrentRow)
  expect(mod.DeleteStatement).toStrictEqual(DeleteStatement)
  expect(mod.Descending).toStrictEqual(Descending)
  expect(mod.Distinct).toStrictEqual(Distinct)
  expect(mod.DistinctOn).toStrictEqual(DistinctOn)
  expect(mod.Division).toStrictEqual(Division)
  expect(mod.DoesNotMatch).toStrictEqual(DoesNotMatch)
  expect(mod.Else).toStrictEqual(Else)
  expect(mod.Equality).toStrictEqual(Equality)
  expect(mod.Except).toStrictEqual(Except)
  expect(mod.Exists).toStrictEqual(Exists)
  expect(mod.Extract).toStrictEqual(Extract)
  expect(mod.False).toStrictEqual(False)
  expect(mod.Following).toStrictEqual(Following)
  expect(mod.FullOuterJoin).toStrictEqual(FullOuterJoin)
  expect(mod.GreaterThan).toStrictEqual(GreaterThan)
  expect(mod.GreaterThanOrEqual).toStrictEqual(GreaterThanOrEqual)
  expect(mod.Group).toStrictEqual(Group)
  expect(mod.Grouping).toStrictEqual(Grouping)
  expect(mod.GroupingElement).toStrictEqual(GroupingElement)
  expect(mod.GroupingSet).toStrictEqual(GroupingSet)
  expect(mod.In).toStrictEqual(In)
  expect(mod.InfixOperation).toStrictEqual(InfixOperation)
  expect(mod.InnerJoin).toStrictEqual(InnerJoin)
  expect(mod.InsertStatement).toStrictEqual(InsertStatement)
  expect(mod.Intersect).toStrictEqual(Intersect)
  expect(mod.Join).toStrictEqual(Join)
  expect(mod.JoinSource).toStrictEqual(JoinSource)
  expect(mod.LessThan).toStrictEqual(LessThan)
  expect(mod.LessThanOrEqual).toStrictEqual(LessThanOrEqual)
  expect(mod.Limit).toStrictEqual(Limit)
  expect(mod.Lock).toStrictEqual(Lock)
  expect(mod.Matches).toStrictEqual(Matches)
  expect(mod.Max).toStrictEqual(Max)
  expect(mod.Min).toStrictEqual(Min)
  expect(mod.Multiplication).toStrictEqual(Multiplication)
  expect(mod.NamedSQLFunction).toStrictEqual(NamedSQLFunction)
  expect(mod.NamedWindow).toStrictEqual(NamedWindow)
  expect(mod.Node).toStrictEqual(Node)
  expect(mod.Not).toStrictEqual(Not)
  expect(mod.NotEqual).toStrictEqual(NotEqual)
  expect(mod.NotIn).toStrictEqual(NotIn)
  expect(mod.NotRegexp).toStrictEqual(NotRegexp)
  expect(mod.Offset).toStrictEqual(Offset)
  expect(mod.On).toStrictEqual(On)
  expect(mod.Or).toStrictEqual(Or)
  expect(mod.Ordering).toStrictEqual(Ordering)
  expect(mod.OuterJoin).toStrictEqual(OuterJoin)
  expect(mod.Over).toStrictEqual(Over)
  expect(mod.Preceding).toStrictEqual(Preceding)
  expect(mod.Quoted).toStrictEqual(Quoted)
  expect(mod.Range).toStrictEqual(Range)
  expect(mod.Regexp).toStrictEqual(Regexp)
  expect(mod.RightOuterJoin).toStrictEqual(RightOuterJoin)
  expect(mod.RollUp).toStrictEqual(RollUp)
  expect(mod.Rows).toStrictEqual(Rows)
  expect(mod.SQLFunction).toStrictEqual(SQLFunction)
  expect(mod.SQLLiteral).toStrictEqual(SQLLiteral)
  expect(mod.SelectCore).toStrictEqual(SelectCore)
  expect(mod.SelectStatement).toStrictEqual(SelectStatement)
  expect(mod.StringJoin).toStrictEqual(StringJoin)
  expect(mod.Subtraction).toStrictEqual(Subtraction)
  expect(mod.Sum).toStrictEqual(Sum)
  expect(mod.TableAlias).toStrictEqual(TableAlias)
  expect(mod.Top).toStrictEqual(Top)
  expect(mod.True).toStrictEqual(True)
  expect(mod.Unary).toStrictEqual(Unary)
  expect(mod.UnaryOperation).toStrictEqual(UnaryOperation)
  expect(mod.Union).toStrictEqual(Union)
  expect(mod.UnionAll).toStrictEqual(UnionAll)
  expect(mod.UnqualifiedColumn).toStrictEqual(UnqualifiedColumn)
  expect(mod.UpdateStatement).toStrictEqual(UpdateStatement)
  expect(mod.Values).toStrictEqual(Values)
  expect(mod.ValuesList).toStrictEqual(ValuesList)
  expect(mod.When).toStrictEqual(When)
  expect(mod.Window).toStrictEqual(Window)
  expect(mod.With).toStrictEqual(With)
  expect(mod.WithRecursive).toStrictEqual(WithRecursive)
})
