import * as Babel from "@babel/core";
import { UserConfig } from '../utils/config'
import { MacroParams } from 'babel-plugin-macros'
import { isAssignedToVariable, isFunction, isValue } from '../utils/babel'

export function whenProd(config: UserConfig, t: MacroParams["babel"]["types"], references: Babel.NodePath[]) {
  const { env } = config;

  if (!references) return;

  references.forEach(referencePath => {
    const isProd = env === 'production';
    if (!referencePath.parentPath) return;
    if (!referencePath.parentPath.node.arguments) return;
    const args = referencePath.parentPath.node.arguments;
    // check if the function is being assigned to a variable
    const isAssignment = isAssignedToVariable(t, referencePath?.parentPath?.parentPath);

    if (args.length < 1 || args.length > 2) {
      throw new Error('whenProd expects 1 or 2 arguments');
    }

    // check if the first argument is a function
    if (isFunction(t, args[0])) {
      if (isAssignment) {
        throw new Error('whenProd cannot be assigned to a variable when the first argument is a function');
      }

      if (isProd) {
        // wrap the function in an IIFE
        referencePath.parentPath.replaceWith(t.callExpression(args[0], []));
        return;
      } else {
        if (args[1] && isFunction(t, args[1])) {
          referencePath.parentPath.replaceWith(t.callExpression(args[1], []));
          return;
        }
        referencePath.parentPath.remove();
        return;
      }
    }

    // check if the first argument is a value
    if (isValue(t, args[0])) {
      if (isProd) {
        referencePath.parentPath.replaceWith(args[0]);
        return;
      } else {
        if (args[1] && isValue(t, args[1])) {
          referencePath.parentPath.replaceWith(args[1]);
          return;
        }
        referencePath.parentPath.remove();
        return;
      }
    }
  });
}
