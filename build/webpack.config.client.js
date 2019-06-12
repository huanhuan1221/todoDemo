const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HTMLPLUGIN = require("html-webpack-plugin");
const ExtractPlugin = require("extract-text-webpack-plugin");
const baseConfig = require("./webpack.config.base");

const isDev = process.env.NODE_ENV === "development";

const defaultPlugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPLUGIN()
];

const devServer = {
  port: 8000,
  host: "0.0.0.0",
  overlay: {
    //输出错误
    errors: true
  },
  //open:true,//自动发开浏览器
  /* historyFallback:{

    },//路由地址映射 */
  hot: true //重新渲染主键页面，不会页面整体刷新 注：需要添加new webpack.HotModuleReplacementPlugin()和new webpack.NoEmitOnErrorsPlugin()
};

let config;

if (isDev) {
  config = merge(baseConfig, {
    devtool: "#cheap-module-eval-source-map",
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              }
            },
            "stylus-loader"
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, "../client/index.js"),
      vendor: [
        "vue"
      ] /*将框架与业务代码单独打包，是浏览器尽可能久地缓存框架代码而不随着业务修改而刷新*/
    },
    output: {
      filename: "[name].[chunkhash:8].js"
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: "style-loader",
            use: [
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: true
                }
              },
              "stylus-loader"
            ]
          })
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin("styles.[md5:contentHash:8].css")
    ]),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            priority: 10,
            enforce: true
          }
        }
      },
      runtimeChunk: true
    }
  });
}
module.exports = config;
