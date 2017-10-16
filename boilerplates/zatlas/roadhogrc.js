const precss = require('precss');

module.exports = {
  "entry": {
    "index": "./src/index.js"
  },
  "publicPath": "/",
  "extraBabelPlugins": [
    "transform-class-properties",
    "transform-decorators-legacy"
  ],
  "extraPostCSSPlugins": [precss()],
  "define": {
    "ENV_PROD": process.env.NODE_ENV === 'production',
    "API_TEST": process.env.API_ENV === 'test'
  },
  "alias": {
    "react-grid-layout": "libs/react-grid-layout",
    "react-resizable": "libs/react-resizable",
    "lmap": "libs/lmap",
    "lmap-react": "libs/lmap-react"
  },
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        ['transform-runtime', {
          helpers: false,
          polyfill: false,
          regenerator: true, }],
        ["react-css-modules", {
          "generateScopedName": "[local]",
          "webpackHotModuleReloading": true
        }]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["react-css-modules", {
          "generateScopedName": "[local]",
          "webpackHotModuleReloading": true
        }]
      ]
    }
  }
}
