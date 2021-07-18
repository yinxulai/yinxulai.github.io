const constants = require('next/constants')
const { resolve } = require('path')

module.exports = (phase, { defaultConfig }) => {
  const webpack = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  }

  if (phase === constants.PHASE_DEVELOPMENT_SERVER) {
    return { ...defaultConfig, webpack }
  }

  if (phase === constants.PHASE_PRODUCTION_SERVER) {
    return { ...defaultConfig, webpack }
  }

  if (phase === constants.PHASE_PRODUCTION_BUILD) {
    return { ...defaultConfig, webpack }
  }

  if (phase === constants.PHASE_EXPORT) {
    return { ...defaultConfig, webpack }
  }

  return { ...defaultConfig, webpack }
}
