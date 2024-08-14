import { createMacro } from 'babel-plugin-macros';
import { cosmiconfigSync } from 'cosmiconfig';
import { getConfig } from './utils/config'
import * as macros from './macros';

export default createMacro(({ references, babel }) => {
  const config = getConfig()
  const { types: t } = babel

  macros.whenDev(config, t, references.whenDev)
  macros.whenProd(config, t, references.whenProd)
  macros.whenEnv(config, t, references.whenEnv)
  //
  // references.whenProd.forEach(referencePath => {
  //   const [prodValue, devValue] = referencePath.parentPath.node.arguments;
  //   referencePath.parentPath.replaceWith(env === 'production' ? prodValue : devValue);
  // });
  //
  // references.when.forEach(referencePath => {
  //   const [env, value, defaultValue] = referencePath.parentPath.node.arguments;
  //   referencePath.parentPath.replaceWith(env.value === env ? value : defaultValue);
  // });
  //
  // references.whenEnv.forEach(referencePath => {
  //   const [envs, value, defaultValue] = referencePath.parentPath.node.arguments;
  //   const envArray = Array.isArray(envs.value) ? envs.value : [envs.value];
  //   referencePath.parentPath.replaceWith(envArray.includes(env) ? value : defaultValue);
  // });
  //
  // references.switchEnv.forEach(referencePath => {
  //   const [cases, defaultValue] = referencePath.parentPath.node.arguments;
  //   const envCase = cases.properties.find(prop => prop.key.value === env);
  //   referencePath.parentPath.replaceWith(envCase ? envCase.value : defaultValue);
  // });
  //
  // references.whenFeature.forEach(referencePath => {
  //   const [feature, value, defaultValue] = referencePath.parentPath.node.arguments;
  //   const features = Array.isArray(feature.value) ? feature.value : [feature.value];
  //   referencePath.parentPath.replaceWith(features.some(f => process.env[f]) ? value : defaultValue);
  // });
  //
  // references.switchFeature.forEach(referencePath => {
  //   const [cases, defaultValue] = referencePath.parentPath.node.arguments;
  //   const featureCase = cases.properties.find(prop => process.env[prop.key.value]);
  //   referencePath.parentPath.replaceWith(featureCase ? featureCase.value : defaultValue);
  // });
});

export declare function whenDev<T>(devValue: T, prodValue: T): T;
export declare function whenProd<T>(prodValue: T, devValue: T): T;
export declare function when<T>(envs: string | string[], value: T, defaultValue: T): T;
export declare function whenEnv<T>(envs: string | string[], value: T, defaultValue: T): T;
export declare function switchEnv<T>(cases: Record<string, T>, defaultValue: T): T;
export declare function whenFeature<T>(feature: string | string[], value: T, defaultValue: T): T;
export declare function switchFeature<T>(cases: Record<string, T>, defaultValue: T): T;

