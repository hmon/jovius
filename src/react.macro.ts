import React from 'react'
import { createMacro } from 'babel-plugin-macros'

export default createMacro(({ references, babel }) => {
  const { types: t } = babel

  references.DevOnly.forEach(referencePath => {
    const [devValue, fallback] = referencePath.parentPath.node.arguments
    referencePath.parentPath.replaceWith(process.env.NODE_ENV === 'development' ? devValue : fallback)
  })

  references.ProdOnly.forEach(referencePath => {
    const [prodValue, fallback] = referencePath.parentPath.node.arguments
    referencePath.parentPath.replaceWith(process.env.NODE_ENV === 'production' ? prodValue : fallback)
  })

  references.When.forEach(referencePath => {
    const { is, isDev, isProd, feature, children, fallback } = referencePath.parentPath.node.arguments.reduce((acc, arg) => {
      if (t.isStringLiteral(arg)) {
        acc.is = arg.value
      } else if (t.isArrayExpression(arg)) {
        acc.feature = arg.elements.map(e => e.value)
      } else if (t.isJSXElement(arg)) {
        acc.children = arg
      } else if (t.isJSXFragment(arg)) {
        acc.children = arg
      } else if (t.isBooleanLiteral(arg)) {
        if (arg.value) {
          acc.isDev = true
        } else {
          acc.isProd = true
        }
      } else {
        acc.fallback = arg
      }
      return acc
    }, {} as { is?: string, isDev?: boolean, isProd?: boolean, feature?: string[], children?: React.ReactNode, fallback?: React.ReactNode })

    if (isDev && process.env.NODE_ENV !== 'development') {
      referencePath.parentPath.replaceWith(fallback)
    } else if (isProd && process.env.NODE_ENV !== 'production') {
      referencePath.parentPath.replaceWith(fallback)
    } else if (is && process.env.NODE_ENV !== is) {
      referencePath.parentPath.replaceWith(fallback)
    } else if (feature && !feature.some(f => process.env[f])) {
      referencePath.parentPath.replaceWith(fallback)
    } else {
      referencePath.parentPath.replaceWith(children)
    }
  })
})

export declare const DevOnly: React.FC<{
  children?: React.ReactNode,
  fallback?: React.ReactNode
}>;
export declare const ProdOnly: React.FC<{
  children?: React.ReactNode,
  fallback?: React.ReactNode
}>;
export declare const When: React.FC<{
  is?: string | string[],
  isDev?: boolean,
  isProd?: boolean,
  feature?: string | string[],
  children?: React.ReactNode,
  fallback?: React.ReactNode
}>;
export declare const withDev: <T>(Component: T) => T;
export declare const withProd: <T>(Component: T) => T;
export declare const withEnv: <T>(Component: T, envs: string | string[]) => T;
export declare const withFeature: <T>(Component: T, features: string | string[]) => T;
