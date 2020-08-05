const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const path = require("path");

module.exports = {
  transpileDependencies: [],
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/styles/_reset.scss";
          @import "@/assets/styles/_variables.scss";
          @import "@/assets/styles/_mixins.scss";
          `
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
      ]),
      new CompressionPlugin()
    ]
  },
  runtimeCompiler: true,
  devServer: {
    host: "0.0.0.0",
    public: "0.0.0.0:8080",
    disableHostCheck: true,
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
