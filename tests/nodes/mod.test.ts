import * as mod from '../../src/nodes/mod.js'
import Addition from '../../src/nodes/Addition.js'
import And from '../../src/nodes/And.js'
import As from '../../src/nodes/As.js'
import Ascending from '../../src/nodes/Ascending.js'
import Assignment from '../../src/nodes/Assignment.js'
import Avg from '../../src/nodes/Avg.js'
import Between from '../../src/nodes/Between.js'
import Bin from '../../src/nodes/Bin.js'
import Binary from '../../src/nodes/Binary.js'
import BindParam from '../../src/nodes/BindParam.js'
import BitwiseAnd from '../../src/nodes/BitwiseAnd.js'
import BitwiseNot from '../../src/nodes/BitwiseNot.js'
import BitwiseOr from '../../src/nodes/BitwiseOr.js'
import BitwiseShiftLeft from '../../src/nodes/BitwiseShiftLeft.js'
import BitwiseShiftRight from '../../src/nodes/BitwiseShiftRight.js'
import BitwiseXor from '../../src/nodes/BitwiseXor.js'
import Case from '../../src/nodes/Case.js'
import Casted from '../../src/nodes/Casted.js'
import Comment from '../../src/nodes/Comment.js'
import Concat from '../../src/nodes/Concat.js'
import Count from '../../src/nodes/Count.js'
import Cube from '../../src/nodes/Cube.js'
import CurrentRow from '../../src/nodes/CurrentRow.js'
import DeleteStatement from '../../src/nodes/DeleteStatement.js'
import Descending from '../../src/nodes/Descending.js'
import Distinct from '../../src/nodes/Distinct.js'
import DistinctOn from '../../src/nodes/DistinctOn.js'
import Division from '../../src/nodes/Division.js'
import DoesNotMatch from '../../src/nodes/DoesNotMatch.js'
import Else from '../../src/nodes/Else.js'
import Equality from '../../src/nodes/Equality.js'
import Except from '../../src/nodes/Except.js'
import Exists from '../../src/nodes/Exists.js'
import Extract from '../../src/nodes/Extract.js'
import False from '../../src/nodes/False.js'
import Following from '../../src/nodes/Following.js'
import FullOuterJoin from '../../src/nodes/FullOuterJoin.js'
import GreaterThan from '../../src/nodes/GreaterThan.js'
import GreaterThanOrEqual from '../../src/nodes/GreaterThanOrEqual.js'
import Group from '../../src/nodes/Group.js'
import Grouping from '../../src/nodes/Grouping.js'
import GroupingElement from '../../src/nodes/GroupingElement.js'
import GroupingSet from '../../src/nodes/GroupingSet.js'
import In from '../../src/nodes/In.js'
import InfixOperation from '../../src/nodes/InfixOperation.js'
import InnerJoin from '../../src/nodes/InnerJoin.js'
import InsertStatement from '../../src/nodes/InsertStatement.js'
import Intersect from '../../src/nodes/Intersect.js'
import IsDistinctFrom from '../../src/nodes/IsDistinctFrom.js'
import IsNotDistinctFrom from '../../src/nodes/IsNotDistinctFrom.js'
import Join from '../../src/nodes/Join.js'
import JoinSource from '../../src/nodes/JoinSource.js'
import Lateral from '../../src/nodes/Lateral.js'
import LessThan from '../../src/nodes/LessThan.js'
import LessThanOrEqual from '../../src/nodes/LessThanOrEqual.js'
import Limit from '../../src/nodes/Limit.js'
import Lock from '../../src/nodes/Lock.js'
import Matches from '../../src/nodes/Matches.js'
import Max from '../../src/nodes/Max.js'
import Min from '../../src/nodes/Min.js'
import Multiplication from '../../src/nodes/Multiplication.js'
import NamedSQLFunction from '../../src/nodes/NamedSQLFunction.js'
import NamedWindow from '../../src/nodes/NamedWindow.js'
import Node from '../../src/nodes/Node.js'
import NodeExpression from '../../src/nodes/NodeExpression.js'
import Not from '../../src/nodes/Not.js'
import NotEqual from '../../src/nodes/NotEqual.js'
import NotIn from '../../src/nodes/NotIn.js'
import NotRegexp from '../../src/nodes/NotRegexp.js'
import Offset from '../../src/nodes/Offset.js'
import On from '../../src/nodes/On.js'
import OptimizerHints from '../../src/nodes/OptimizerHints.js'
import Or from '../../src/nodes/Or.js'
import Ordering from '../../src/nodes/Ordering.js'
import OuterJoin from '../../src/nodes/OuterJoin.js'
import Over from '../../src/nodes/Over.js'
import Preceding from '../../src/nodes/Preceding.js'
import Quoted from '../../src/nodes/Quoted.js'
import Range from '../../src/nodes/Range.js'
import Regexp from '../../src/nodes/Regexp.js'
import RightOuterJoin from '../../src/nodes/RightOuterJoin.js'
import RollUp from '../../src/nodes/RollUp.js'
import Rows from '../../src/nodes/Rows.js'
import SQLFunction from '../../src/nodes/SQLFunction.js'
import SQLLiteral from '../../src/nodes/SQLLiteral.js'
import SelectCore from '../../src/nodes/SelectCore.js'
import SelectStatement from '../../src/nodes/SelectStatement.js'
import StringJoin from '../../src/nodes/StringJoin.js'
import Subtraction from '../../src/nodes/Subtraction.js'
import Sum from '../../src/nodes/Sum.js'
import TableAlias from '../../src/nodes/TableAlias.js'
import True from '../../src/nodes/True.js'
import Unary from '../../src/nodes/Unary.js'
import UnaryOperation from '../../src/nodes/UnaryOperation.js'
import Union from '../../src/nodes/Union.js'
import UnionAll from '../../src/nodes/UnionAll.js'
import UnqualifiedColumn from '../../src/nodes/UnqualifiedColumn.js'
import UpdateStatement from '../../src/nodes/UpdateStatement.js'
import ValuesList from '../../src/nodes/ValuesList.js'
import When from '../../src/nodes/When.js'
import Window from '../../src/nodes/Window.js'
import With from '../../src/nodes/With.js'
import WithRecursive from '../../src/nodes/WithRecursive.js'

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
  expect(mod.Comment).toStrictEqual(Comment)
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
  expect(mod.IsDistinctFrom).toStrictEqual(IsDistinctFrom)
  expect(mod.IsNotDistinctFrom).toStrictEqual(IsNotDistinctFrom)
  expect(mod.Join).toStrictEqual(Join)
  expect(mod.JoinSource).toStrictEqual(JoinSource)
  expect(mod.Lateral).toStrictEqual(Lateral)
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
  expect(mod.NodeExpression).toStrictEqual(NodeExpression)
  expect(mod.Not).toStrictEqual(Not)
  expect(mod.NotEqual).toStrictEqual(NotEqual)
  expect(mod.NotIn).toStrictEqual(NotIn)
  expect(mod.NotRegexp).toStrictEqual(NotRegexp)
  expect(mod.Offset).toStrictEqual(Offset)
  expect(mod.On).toStrictEqual(On)
  expect(mod.OptimizerHints).toStrictEqual(OptimizerHints)
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
  expect(mod.True).toStrictEqual(True)
  expect(mod.Unary).toStrictEqual(Unary)
  expect(mod.UnaryOperation).toStrictEqual(UnaryOperation)
  expect(mod.Union).toStrictEqual(Union)
  expect(mod.UnionAll).toStrictEqual(UnionAll)
  expect(mod.UnqualifiedColumn).toStrictEqual(UnqualifiedColumn)
  expect(mod.UpdateStatement).toStrictEqual(UpdateStatement)
  expect(mod.ValuesList).toStrictEqual(ValuesList)
  expect(mod.When).toStrictEqual(When)
  expect(mod.Window).toStrictEqual(Window)
  expect(mod.With).toStrictEqual(With)
  expect(mod.WithRecursive).toStrictEqual(WithRecursive)
})
