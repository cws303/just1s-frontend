const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/assets/styles/_variables.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './static'),
          to: "static",
          ignore: ['.*']
        }
      ])
    ]
  },
  devServer: {
    proxy: {
        '/api': {
            target: 'https://localhost:3000' // 개발서버
        }
    },
    https: true
  }
}