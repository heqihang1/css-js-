const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dayjs = require("dayjs");
const fse = require("fs-extra");
const pretty = require("pretty");
const Handlebars = require("handlebars");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin")

// const appConfig = require("./appConfig.js");
// const cssScopedName = appConfig.appKey + "_[path]___[name]__[local]";

module.exports = (env, args = {}) => {
  const { CdnHost, webTitle, runType, cssPrefix = "" } = args;
  // 项目目录名
  const dirName = args.dirName;
  // CSS前缀
  const cssScopedName = args.cssScopedName;
  if (!dirName || !cssScopedName) {
    return {};
  }
  const appRelativePath = `${dirName}`;
  return {
    context: path.resolve(__dirname),
    output: {
      filename: `js/[name].js`,
      publicPath: "/",
    },
    externals: {
      // react: 'React',
      // "react-dom": "ReactDOM",
      fs: require("fs"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, `./src`),
      },
    },
    performance: {
      hints: false,
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|avif|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: `asset/[hash][ext][query]`,
            // publicPath: "",
          },
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
          options: {
            sources: false,
          },
        },
        {
          test: /\.(js|jsx)$/,
          ...(runType == "Build_IE"
            ? {}
            : { exclude: /(node_modules|bower_components)/ }), //为了在开发时，兼容IE热替换调试
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [
                  [
                    "babel-plugin-import", //按需加载antd
                    {
                      libraryName: "antd",
                      libraryDirectory: "es",
                      style: "css",
                    },
                  ],
                  [
                    "babel-plugin-react-css-modules",
                    {
                      webpackHotModuleReloading: true,
                      filetypes: {
                        ".less": {
                          syntax: "postcss-less",
                        },
                        ".scss": {
                          syntax: "postcss-scss",
                        },
                      },
                      generateScopedName: cssScopedName,
                    },
                  ],
                  [
                    "styled-jsx/babel",
                    {
                      plugins: [
                        [
                          "styled-jsx-plugin-postcss",
                          {
                            path: path.resolve(__dirname, "postcss.config.js"),
                            compileEnv: "worker",
                          },
                        ],
                        "@styled-jsx/plugin-sass",
                      ],
                    },
                  ],
                ],
                presets: [
                  ["@babel/preset-env", {}],
                  ["@babel/preset-react", {}],
                ],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          ...(runType == "Build_IE"
            ? {}
            : { exclude: /(node_modules|bower_components)/ }), //为了在开发时，兼容IE热替换调试
          use: [
            {
              loader: "babel-loader",
              options: {
                plugins: [
                  [
                    "babel-plugin-import", //按需加载antd
                    {
                      libraryName: "antd",
                      libraryDirectory: "es",
                      style: "css",
                    },
                  ],
                  [
                    "babel-plugin-react-css-modules",
                    {
                      webpackHotModuleReloading: true,
                      filetypes: {
                        ".less": {
                          syntax: "postcss-less",
                        },
                        ".scss": {
                          syntax: "postcss-scss",
                        },
                      },
                      generateScopedName: cssScopedName,
                    },
                  ],
                  "@babel/plugin-transform-typescript",
                  [
                    "styled-jsx/babel",
                    {
                      plugins: [
                        [
                          "styled-jsx-plugin-postcss",
                          {
                            path: path.resolve(__dirname, "postcss.config.js"),
                            compileEnv: "worker",
                          },
                        ],
                        "@styled-jsx/plugin-sass",
                      ],
                    },
                  ],
                ],
                presets: [
                  ["@babel/preset-env", {}],
                  ["@babel/preset-react", {}],
                  "@babel/preset-typescript", //用于转tsx
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // publicPath: `/${dirName}`,
              },
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
              },
            },
            "postcss-loader",
          ],
        },
        {
          test: /\.less$/i,
          use: [
            ...(runType == "DEV"
              ? ["style-loader"]
              : [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // publicPath: `/${dirName}`,
                  },
                },
              ]),
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: {
                  localIdentName: cssScopedName,
                },
              },
            },
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            ...(runType == "DEV"
              ? ["style-loader"]
              : [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // publicPath: `/${dirName}`,
                  },
                },
              ]),
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: {
                  localIdentName: cssScopedName,
                },
              },
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public/robots.txt"),
            to: path.resolve(__dirname, "build/robots.txt"),
            globOptions: {},
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: `css/[name].[contenthash].css`,
        chunkFilename: `css/[name].[contenthash].css`,
      }),
      new WebpackManifestPlugin({
        // useLegacyEmit: true,
        // writeToFileEmit: true,
        seed: {
          createDt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          des: `构建时间：${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
        },
      }),
      new webpack.DefinePlugin({
        CSS_PREFIX: JSON.stringify(cssPrefix),
        // APP_RELATIVE_PATH: JSON.stringify(appRelativePath), //appRelativePath  APP_RELATIVE_PATH //应用基于网站根的部署目录
      }),
      // main主应用开发和生产都要配置
      new HtmlWebpackPlugin({
        favicon: "./public/logo-ico2.ico",
        inject: "body", //true head body
        // template: "./public/index.template.html",
        hash: true, // 会在打包好的bundle.js后面加上hash串hash: true, // 会在打包好的bundle.js后面加上hash串
        minify: false, //不压缩
        filename: "index.html",
        templateContent: ({ htmlWebpackPlugin }) => {
          const tplFilePath = path.resolve(
            __dirname,
            "public/index.template.html"
          );
          const source = fse.readFileSync(tplFilePath).toString();
          const template = Handlebars.compile(source);
          const data = {
            title: webTitle,
            CDN_HOST: CdnHost || "",
          };
          const result = template(data);
          return result;
        },
      }),
      //编译文件之前的
      new HtmlWebpackTagsPlugin({
        publicPath: CdnHost,
        useHash: true,
        scripts: [],
        links: [],
        append: false,
      }),
      //编译文件之后的
      new HtmlWebpackTagsPlugin({
        publicPath: CdnHost,
        useHash: true,
        scripts: [],
        links: [],
        append: true,
      }),
      new NodePolyfillPlugin(),
      new InterpolateHtmlPlugin({
        PUBLIC_URL: 'static' // can modify `static` to another name or get it from `process`
      }),
    ],
  };
};
