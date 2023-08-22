const path = require("path");
const webpack = require("webpack");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");
const Handlebars = require("handlebars");

module.exports = (env, args = {}) => {
  // 项目目录名
  const dirName = args.dirName;
  return {
    entry: {
      index: [`./src/index.jsx`],
    },
    devtool: "source-map",
    mode: "production", //development 打包速度要快很多，发生产时改成 production,
  };
};
