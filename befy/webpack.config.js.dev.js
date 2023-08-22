const path = require("path");
const webpack = require("webpack");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");
const Handlebars = require("handlebars");

module.exports = (env, args = {}) => {
  const { CdnHost, webTitle } = args;
  // 项目目录名
  const dirName = args.dirName;
  return {
    entry: {
      index: ["webpack-hot-middleware/client", `./src/index.jsx`],
    },
    mode: "development",
    devtool: "eval-source-map",
    plugins: [new webpack.HotModuleReplacementPlugin()],
  };
};
