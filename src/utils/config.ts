import { cosmiconfigSync } from 'cosmiconfig'
import * as process from 'node:process'

export interface UserConfig {
  env?: string;
  target?: string;
}

function parseConfig(config: UserConfig | null) {
  if (!config) {
    return {
      env: process.env.NODE_ENV,
    }
  }

  if (config.target && process.env[config.target]) {
    return {
      env: process.env[config.target],
    }
  }

  return config
}

export function getConfig() {
  const explorer = cosmiconfigSync('jovius')
  const result = explorer.search()

  return parseConfig(result?.config)
}
