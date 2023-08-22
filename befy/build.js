const path = require("path");
const dayjs = require("dayjs"); // require('dayjs/locale/zh-cn'); dayjs.locale('zh-cn');
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const cors = require("cors");
const network = require("network");
const pretty = require("pretty");
const customAlphabet = require("nanoid/non-secure").customAlphabet;
const fse = require("fs-extra");
const { merge } = require("webpack-merge");
const colors = require("colors");
const clear = require("console-clear");
const jsonFormat = require("json-format");

(async () => {
  const appConfig = require("./app.config.js"); // 项目配置
  const dirName = path.basename(path.resolve(__dirname)); // 项目目录名
  console.log("dirName", dirName);
  const appRelativePath = `${dirName}`;
  const dirOutput = path.resolve(`./build`); // 编译输出目录-绝对路径
  try {
    fse.mkdirsSync(dirOutput); // 编译输出目录-创建
  } catch (e) {
    console.log("err", e.message);
  }
  fse.emptyDirSync(dirOutput); // 编译输出目录-清空
  // fse.removeSync(dirOutput); // 编译输出目录-删除
  console.log("dirOutput", dirOutput);

  const cssScopedName = appConfig.appKey + "_[path]___[name]__[local]"; // CSS沙箱隔离前缀
  const cssPrefix = customAlphabet("abcdefghijklmnopqrstuvwxyz", 12)(); //第三方CSS前缀

  const webTitle = appConfig.webTitle; // 开发环境网页标题

  // web服务器ip和端口
  const port = appConfig.port || 8080;
  let ip = "127.0.0.1";
  console.log(`本地访问： http://${ip}:${port}`);
  // // 内网ip
  // ip = await new Promise((resolve) => {
  //   network.get_private_ip(function (err, privateIp) {
  //     if (err) {
  //       resolve(ip);
  //       console.log("获取远程ip失败", err.message);
  //     } else {
  //       resolve(privateIp);
  //       console.log(`privateIp： http://${privateIp}:${port}`);
  //     }
  //   });
  // });
  const CdnHost = `http://${ip}:7001`;
  // webpack配置
  const commonConfig = require("./webpack.config.js.common.js")(process.env, {
    runType: "Build_IE",
    dirName: dirName,
    cssScopedName: cssScopedName,
    cssPrefix: cssPrefix,
    webTitle: webTitle,
  });
  let buildConfig = require("./webpack.config.js.build.js")(process.env, {
    dirName: dirName,
  });
  buildConfig = merge(buildConfig, {
    output: {
      path: dirOutput,
      // publicPath: `${appRelativePath}/`,
    },
    plugins: [
      // 监听编译进度
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const per = Math.round(percentage * 100);
        clear(true);
        console.log(colors.gray(message, `${per}%`, ...args));
      }),
    ],
  });
  const webpackConfig = merge(commonConfig, buildConfig);
  if (typeof webpackConfig.entry !== "object") {
    console.log(
      colors.blue.underline("入口文件配置必须是对象", "webpackConfig.entry")
    );
    return;
  }
  // 开始编译
  const compiler = webpack(webpackConfig);
  // 监听编译结果
  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      setTimeout(async () => {
        const info = stats.toJson();
        if (stats.hasErrors()) {
          info.errors.map((errObj) => {
            console.log(colors.green("编译错误", errObj.message));
          });
          process.exit(1);
        }
        console.log(colors.white("编译信息："));
        for (let key in info) {
          if (!["object", "undefined"].includes(typeof info[key])) {
            console.log(colors.grey(key), colors.yellow(info[key]));
          }
        }
        process.exit(0);
      });
    }
  );
})();
