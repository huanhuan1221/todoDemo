const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const webpack = require("webpack");
const HTMLPLUGIN = require("html-webpack-plugin");
const ExtractPlugin = require("extract-text-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "./src/index.js"), //入口
  output: {
    //出口
    filename: "bundle.[hash:8]js", //出口文件名
    path: path.join(__dirname, "dist") //出口文件打包的文件
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPLUGIN()
  ],
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.jsx$/, loader: "babel-loader" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },

      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "[name]-huanhuan.[ext]"
            }
          }
        ]
      }
    ]
  },
  performance: {
    hints: "warning" /*或者直接关闭hints:false*/,
    //入口起点的最大体积
    maxEntrypointSize: 50000000,
    //生成文件的最大体积
    maxAssetSize: 30000000,
    //只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith(".js");
    }
  }
};
if (isDev) {
  config.module.rules.push({
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
  });
  config.devtool = "#cheap-module-eval-source-map"; //帮助调试
  config.devServer = {
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
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
} else {
  config.entry = {
    app: path.join(__dirname, "src/index.js"),
    vendor: ["vue"]/*将框架与业务代码单独打包，是浏览器尽可能久地缓存框架代码而不随着业务修改而刷新*/
  };
  config.output.filename = "[name].[chunkhash:8].js";
  config.module.rules.push({
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
  });
  config.plugins.push(new ExtractPlugin("styles.[md5:contentHash:8].css"));
  config.optimization = {
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
  };
}
module.exports = config;
