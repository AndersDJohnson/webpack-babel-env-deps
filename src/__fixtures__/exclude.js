import modules from './modules'

export default new RegExp(`node_modules/(?!(/|\\\\)(${modules})(/|\\\\))`)
