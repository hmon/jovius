import * as Babel from "@babel/core";
import { UserConfig } from '../utils/config'
import { MacroParams } from 'babel-plugin-macros'

export function whenEnv(config: UserConfig, t: MacroParams["babel"]["types"], references: Babel.NodePath[]) {
  const { env } = config;

  if (!references) return;

  references.forEach(referencePath => {
    if (!referencePath.parentPath) return;
    if (!referencePath.parentPath.node.arguments) return;
    const args = referencePath.parentPath.node.arguments;

    if (args.length < 2 || args.length > 3) {
      throw new Error('whenEnv expects 2 or 3 arguments');
    }

    const [envs, value, defaultValue] = args;
    const envArray = Array.isArray(envs.value) ? envs.value : [envs.value];
    if (envArray.includes(env)) {
      referencePath.parentPath.replaceWith(value);
    } else {
      referencePath.parentPath.replaceWith(defaultValue);
    }
  });
}
