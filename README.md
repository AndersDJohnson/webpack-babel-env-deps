# webpack-babel-env-deps
> Find node modules to transpile with Babel.

Finds dependencies that specify minimum node engines that assume features
provided by plugins and polyfills in [`babel-preset-env`][babel-preset-env]
and therefore require transpilation.

Generates regular expressions to be used in the `exclude` or `include` properties
of your [`babel-loader`][babel-loader] rule in your configuration.

## Install

[![yarn add -D webpack-babel-env-deps (copy)](https://copyhaste.com/i?t=yarn%20add%20-D%20webpack-babel-env-deps)](https://copyhaste.com/c?t=yarn%20add%20-D%20webpack-babel-env-deps "yarn add -D webpack-babel-env-deps (copy)")

or:

[![npm install -D webpack-babel-env-deps (copy)](https://copyhaste.com/i?t=npm%20install%20-D%20webpack-babel-env-deps)](https://copyhaste.com/c?t=npm%20install%20-D%20webpack-babel-env-deps "npm install -D webpack-babel-env-deps (copy)")

## Use

```
import babelEnvDeps from 'webpack-babel-env-deps'

export default {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          babelEnvDeps.exclude()
          // generated: /node_modules\/(?!(detect-indent|request|...)).*/
        ],
        use: {
          loader: 'babel-loader',
          // specify options here or in `.babelrc`
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
}
```

## Issues

* https://github.com/babel/babel-loader/issues/171


[babel-loader]: https://github.com/babel/babel-loader
[babel-preset-env]: https://github.com/babel/babel-preset-env
