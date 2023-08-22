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

(async () => {
  const appConfig = require("./app.config.js"); // 项目配置
  const dirName = path.basename(path.resolve(__dirname)); // 项目目录名
  console.log("dirName", dirName);
  const dirOutput = path.resolve(__dirname, `./build`); // 编译输出目录-绝对路径
  try {
    fse.mkdirsSync(dirOutput); // 编译输出目录-创建
  } catch (e) {
    console.log("err", e.message);
  }
  fse.emptyDirSync(dirOutput); // 编译输出目录-清空
  fse.removeSync(dirOutput); // 编译输出目录-删除
  console.log("dirOutput", dirOutput);

  const cssScopedName = appConfig.appKey + "_[path]___[name]__[local]"; // CSS沙箱隔离前缀
  const cssPrefix = customAlphabet("abcdefghijklmnopqrstuvwxyz", 12)(); //第三方CSS前缀
  const webTitle = appConfig.webTitle; // 开发环境网页标题

  // web服务器ip和端口
  const port = appConfig.port || 8080;
  let ip = "127.0.0.1";
  console.log(`本地访问： http://${ip}:${port}`);
  // // 内网ip
  ip = await new Promise((resolve) => {
    network.get_private_ip(function (err, privateIp) {
      if (err) {
        resolve(ip);
        console.log("获取远程ip失败", err.message);
      } else {
        resolve(privateIp);
        console.log(`privateIp： http://${privateIp}:${port}`);
      }
    });
  });
  // // 外网ip
  // ip = await new Promise((resolve) => {
  //   network.get_public_ip(function (err, publicIp) {
  //     if (err) {
  //       resolve(ip);
  //       console.log("获取远程ip失败", err.message);
  //     } else {
  //       resolve(publicIp);
  //       console.log(`publicIp： http://${publicIp}:${port}`);
  //     }
  //   });
  // });
  const CdnHost = `http://${ip}:7001`;
  const runType = process.argv[2] || "dev";
  // webpack配置
  const commonConfig = merge(
    require("./webpack.config.js.common.js")(process.env, {
      runType: runType,
      dirName: dirName,
      cssScopedName: cssScopedName,
      cssPrefix: cssPrefix,
      CdnHost: CdnHost,
      webTitle: webTitle,
    }),
    {}
  );
  const devConfig = merge(
    require("./webpack.config.js.dev.js")(process.env, {
      CdnHost: CdnHost,
      webTitle: webTitle,
      dirName: dirName,
    }),
    {
      output: {
        path: dirOutput,
      },
      plugins: [
        // 监听编译进度
        new webpack.ProgressPlugin((percentage, message, ...args) => {
          const per = Math.round(percentage * 100);
          clear(true);
          console.log(colors.gray(message, `${per}%`, ...args));
        }),
      ],
    }
  );
  const webpackConfig = merge(commonConfig, devConfig);
  if (typeof webpackConfig.entry !== "object") {
    console.log(
      colors.blue.underline("入口文件配置必须是对象", "webpackConfig.entry")
    );
    return;
  }
  // 开始编译
  const compiler = webpack(webpackConfig);
  // // 编译之前执行
  // await new Promise((resolve) => {
  //   compiler.hooks.beforeRun.callAsync(this, async () => {
  //     await require("./build-antd-scope.js").default(cssPrefix);
  //     await require("./build-antd-vars.js").default();
  //     resolve("Y");
  //   });
  // });
  // 监听编译结果
  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      setTimeout(() => {
        const info = stats.toJson();
        if (stats.hasErrors()) {
          // info.errors.map((errObj) => {
          //   console.log(colors.green(errObj.message));
          // });
          console.log(colors.green(info.errors[0].message));
          return;
        }
        console.log(colors.white("编译信息："));
        for (let key in info) {
          if (!["object", "undefined"].includes(typeof info[key])) {
            console.log(colors.grey(key), colors.yellow(info[key]));
          }
        }
        console.log(colors.grey("CdnHost"), colors.yellow(CdnHost));
        console.log(colors.grey("runType"), colors.yellow(runType));
        console.log(colors.white("入口文件："));
        for (const key in webpackConfig.entry) {
          const entry = webpackConfig.entry[key];
          console.log(colors.grey(key), colors.yellow(entry));
        }
        console.log(colors.white("输出文件："));
        info.assets.map(({ name, size }) => {
          let sizeKb = Math.round((size * 10000) / 1024 / 100) / 100;
          console.log(colors.grey(name), colors.yellow(`${sizeKb} KB`));
        });
        console.log(
          colors.white(`本机访问地址`),
          colors.blue.underline(`http://127.0.0.1:${port}`)
        );
        console.log(
          colors.white(`局域访问地址`),
          colors.blue.underline(`http://${ip}:${port}`)
        );
      });
    }
  );
  // 热替换中间件
  const instance = webpackDevMiddleware(compiler, {
    serverSideRender: true, // 启用SSR，才能从内存中读取文件
    writeToDisk: true, // 是否写入硬盘
    // publicPath: "", // 内存中的资源路径，相对于host
    index: false, // true时，默认返回index.html，不必app.get("*")返回
    stats: "none", // 不打印输出
  });
  // web服务器
  const app = express();
  app.use(cors());
  app.use(express.static(path.join(__dirname, "static"))); //第三方库与主应用共享 , 如富文本编辑器
  // 使用中间件内存资源
  app.use(instance);
  app.use(webpackHotMiddleware(compiler, {}));
  // 路由请求
  app.get("*", (req, res, next) => {
    const { devMiddleware } = res.locals.webpack;
    const outputFileSystem = devMiddleware.outputFileSystem;
    const jsonWebpackStats = devMiddleware.stats.toJson();
    const { assetsByChunkName, outputPath } = jsonWebpackStats;

    let result = outputFileSystem.readFileSync(
      path.join(outputPath, "index.html")
    );

    result = pretty(result.toString());
    res.set("content-type", "text/html");
    res.send(result);
    res.end();
  });
  //首次编译后的回调函数
  instance.waitUntilValid(function () {
    // 可在此自动打开浏览器
    console.log(`首次编译成功.${dayjs().format("YYYY-MM-DDTHH:mm:ss.SSSZZ")}`);
    app.listen(port, async () => {
      console.log(`启动express`, new Date().toLocaleString());
    });
  });
})();
