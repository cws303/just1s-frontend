const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
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
          from: path.resolve(__dirname, "./static"),
          to: "static",
          ignore: [".*"]
        }
      ])
    ]
  },
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    },
    https: true
  }
};
