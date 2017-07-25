import path from 'path'
import nodeExternals from 'webpack-node-externals'
import babelEnvDeps from './src'


const here = p => path.join(__dirname, p)

export default {
  entry: './src/index.js',
  output: {
    path: here('dist'),
    filename: 'index.js',
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
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
}
