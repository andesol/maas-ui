const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common.js");

const publicPath = "/";

module.exports = merge(common, {
  mode: "development",
  output: {
    publicPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.ejs"),
      inject: false,
      templateParameters: {
        legacyStylesheet: `/MAAS/assets/css/maas.css`,
        publicPath,
        uiStylesheet: null,
      },
    }),
  ],
  devtool: "inline-source-map",
  devServer: {
    allowedHosts: "all",
    devMiddleware: {
      writeToDisk: true,
    },
    historyApiFallback: true,
    host: "0.0.0.0",
    open: ["http://0.0.0.0:8400/MAAS/r/machines"],
    port: 8404,
  },
});
