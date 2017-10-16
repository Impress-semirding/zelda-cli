module.exports = {
  "entry": "src/index.js",
  "publicPath": "/",
  "extraBabelPlugins": [
    "transform-runtime"
  ],
  "define": {
    "ENV_PROD": process.env.NODE_ENV === 'production',
    "API_TEST": process.env.API_ENV === 'test'
  },
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    },
    "production": {
      "filename": "assets/[name]-[hash:8].js",
      "chunkFilename": "assets/[name]-[hash:8].js",
      "extractCssName": "assets/[name].[hash:8].css"
    }
  }
}
