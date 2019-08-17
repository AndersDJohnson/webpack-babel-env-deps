import path from 'path'
import nodeExternals from 'webpack-node-externals'
import babelEnvDeps from './src'

export default {
  mode: 'production',
  output: {
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [
          babelEnvDeps.exclude()
          // generates: /node_modules\/(?!(detect-indent|request)).*/
        ],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
