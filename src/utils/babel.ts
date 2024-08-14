// @ts-ignore
import * as Babel from "@babel/core";
import { MacroParams } from 'babel-plugin-macros'

export function isFunction(t: MacroParams["babel"]["types"], val: any) {
  return t.isFunctionExpression(val) || t.isArrowFunctionExpression(val);
}

export function isValue(t: MacroParams["babel"]["types"], val: any) {
  return t.isStringLiteral(val) || t.isNumericLiteral(val) || t.isBooleanLiteral(val);
}

export function isAssignedToVariable(t: MacroParams["babel"]["types"], path: Babel.NodePath | null) {
  const grandParentPath = path?.parentPath?.parentPath;
  return grandParentPath && t.isVariableDeclarator(grandParentPath.node);
}
