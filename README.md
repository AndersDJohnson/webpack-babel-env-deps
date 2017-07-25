# webpack-babel-env-deps
> Find dependencies to transpile with Babel.

[![npm](https://img.shields.io/npm/v/webpack-babel-env-deps.svg)](https://www.npmjs.com/package/webpack-babel-env-deps)
[![Travis CI](https://img.shields.io/travis/AndersDJohnson/webpack-babel-env-deps.svg)](https://travis-ci.org/AndersDJohnson/webpack-babel-env-deps)
[![Codecov](https://img.shields.io/codecov/c/github/AndersDJohnson/webpack-babel-env-deps.svg)](https://codecov.io/gh/AndersDJohnson/webpack-babel-env-deps)

A webpack helper to find dependencies of your project that require transpilation with Babel,
based on [minimum Node.js engines](https://docs.npmjs.com/files/package.json#engines)
that assume features provided by plugins and polyfills from [`babel-preset-env`][babel-preset-env]
and unsupported by the [native UglifyJS webpack plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)
through at least verison `3.x`.

This module generates regular expressions to be used in the `exclude` or `include` properties
of your [`babel-loader`][babel-loader] rule in your configuration.

For example, [`strip-indent`](https://github.com/sindresorhus/strip-indent)
(as of July 2017) specifies a minimum Node.js engine of [`>=4`](https://github.com/sindresorhus/strip-indent/blob/master/package.json#L13)
and uses features like arrow functions (see [strip-indent#1][strip-indent-1]) that must be transpiled.
See [issues](#issues) below for more examples.

## Install

[![yarn add -D webpack-babel-env-deps (copy)](https://copyhaste.com/i?t=yarn%20add%20-D%20webpack-babel-env-deps)](https://copyhaste.com/c?t=yarn%20add%20-D%20webpack-babel-env-deps "yarn add -D webpack-babel-env-deps (copy)")

or:

[![npm install -D webpack-babel-env-deps (copy)](https://copyhaste.com/i?t=npm%20install%20-D%20webpack-babel-env-deps)](https://copyhaste.com/c?t=npm%20install%20-D%20webpack-babel-env-deps "npm install -D webpack-babel-env-deps (copy)")

## Use

```js
import babelEnvDeps from 'webpack-babel-env-deps'

export default {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          babelEnvDeps.exclude() // returns /node_modules\/(?!(detect-indent|request|...)).*/
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

* https://github.com/webpack/webpack/issues/2031
* https://github.com/babel/babel-loader/issues/171
* [https://github.com/sindresorhus/strip-indent/issues/1][strip-indent-1]
* https://github.com/caolan/async/issues/1351

## Reference

* http://2ality.com/2017/07/npm-packages-via-babel.html
* http://2ality.com/2017/06/pkg-esnext.html
* https://github.com/SamVerschueren/babel-engine-plugin

[strip-indent-1]: https://github.com/sindresorhus/strip-indent/issues/1
[babel-loader]: https://github.com/babel/babel-loader
[babel-preset-env]: https://github.com/babel/babel-preset-env
