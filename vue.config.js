const path = require("path");
const sourceMap = process.env.NODE_ENV === "development";

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  chainWebpack: () => {},
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置
      config.mode = "production";
    } else {
      // 为开发环境修改配置
      config.mode = "development";
    }

    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
        alias: {
          vue$: "vue/dist/vue.js",
          "@": path.resolve(__dirname, "./src"),
          "@c": path.resolve(__dirname, "./src/components")
        }
      }
    });
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: sourceMap,
  parallel: require("os").cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  // devServer: {
  //     open: true, // 启动后自动打开浏览器
  //     host: "localhost",
  //     port: 9002,
  //     ,
  //     https: false,
  //     hotOnly: false,
  //     proxy: {
  //         // 设置代理
  //         // proxy all requests starting with /api to jsonplaceholder
  //         "/api": {
  //             target: "http://localhost:3000/",
  //             changeOrigin: true,
  //             ws: true,
  //             pathRewrite: {
  //                 "^/api": ""
  //             }
  //         }
  //     },
  //     before: app => {}
  // },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
