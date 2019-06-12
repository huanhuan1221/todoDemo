const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const config = {
  target: "web",
  entry: path.join(__dirname, "../client/index.js"), //入口
  output: {
    //出口
    filename: "bundle.[hash:8]js", //出口文件名
    path: path.join(__dirname, "../dist") //出口文件打包的文件
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.jsx$/, loader: "babel-loader" },
      { test: /\.js$/, loader: "babel-loader",exclude:/node_modules/ },
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
              name: "resources/[path][name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  }
};
module.exports = config;
