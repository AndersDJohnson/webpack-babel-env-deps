# webpack-babel-env-deps
> Find dependencies to transpile with Babel.

[![npm](https://img.shields.io/npm/v/webpack-babel-env-deps.svg)](https://www.npmjs.com/package/webpack-babel-env-deps)
[![Travis CI](https://img.shields.io/travis/AndersDJohnson/webpack-babel-env-deps.svg)](https://travis-ci.org/AndersDJohnson/webpack-babel-env-deps)
[![Codecov](https://img.shields.io/codecov/c/github/AndersDJohnson/webpack-babel-env-deps.svg)](https://codecov.io/gh/AndersDJohnson/webpack-babel-env-deps)

A webpack helper to find dependencies of your project that require transpilation with Babel (and [`babel-preset-env`][babel-preset-env]),
based on minimum Node.js engines ([`engines`][engines] in `package.json`) or ES2015/ES6+ source ([`module`][module]/`jsnext:main` in `package.json`), which assume features provided by plugins and polyfills from [`babel-preset-env`][babel-preset-env], and are [unsupported](https://github.com/babel/babel-preset-env#targetsuglify) by the [native UglifyJS webpack plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)
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
          babelEnvDeps.exclude() // returns /node_modules(?!(/|\\)(detect-indent|request|...)(/|\\))/
        ],
        use: {
          loader: 'babel-loader',
          // specify options here or in `.babelrc`
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['> 1%, last 2 versions, Firefox ESR'],
                  uglify: true
                }
              }]
            ]
          }
        }
      }
    ]
  }
}
```

### Options

Functions `exclude` amd `include` accept an optional `options` object with following properties:

#### `mainFields`

`?array`

Optional. This should match your [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields)
if you specify it in your webpack config, else it assumes the default of `['browser', 'module', 'main']`.
This is used to determine modules published with ES2015+ module support as `module`/`jsnext:main`,
which by default webpack will load in preference to `main`, so that its
`engines` field probably reflects `main` support rather than `module`/`jsnext:main` support,
so we must assume we must transpile the `module`/`jsnext:main` version.

#### `except`

`?array | ?string | ?function`

Optional. This adds exceptions to the inclusion or exclusion rules.
For example, `include({ except: ['foo'] })` will prevent `foo` from being
included for transpilation even if it would normally meet the criteria.
And `exclude({ except: ['foo'] })` will include `foo` for transpilation
even if it doesn't otherwise meet transpilation criteria.

## Issues

* https://github.com/webpack/webpack/issues/2031
* https://github.com/webpack/webpack/issues/2031#issuecomment-315797985
* https://github.com/webpack/webpack/issues/4296
* https://github.com/babel/babel-loader/issues/171
* [https://github.com/sindresorhus/strip-indent/issues/1][strip-indent-1]
* https://github.com/sindresorhus/pretty-bytes/issues/31
* https://github.com/sindresorhus/ama/issues/446
* https://github.com/caolan/async/issues/1351

## Reference

* https://github.com/facebookincubator/create-react-app/issues/1125#issuecomment-264217076
* https://github.com/babel/babel-preset-env#targetsuglify
* https://webpack.js.org/configuration/resolve/#resolve-mainfields
* http://2ality.com/2017/07/npm-packages-via-babel.html
* http://2ality.com/2017/06/pkg-esnext.html
* https://github.com/SamVerschueren/babel-engine-plugin

[engines]: https://docs.npmjs.com/files/package.json#engines
[module]: https://github.com/rollup/rollup/wiki/pkg.module
[strip-indent-1]: https://github.com/sindresorhus/strip-indent/issues/1
[babel-loader]: https://github.com/babel/babel-loader
[babel-preset-env]: https://github.com/babel/babel-preset-env
