# shop


> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm i webpack vue vue-loader
npm i css-loader vue-template-compiler


# webpack.config.js 配置文件
    entry 入口
    output 出口
    注意 Vue Loader v15 现在需要配合一个 webpack 插件才能正确使用：
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    module.exports = {
        // ...
        plugins: [
            new VueLoaderPlugin()
        ]
    }

    module rules 规则  访问.vue文件 css images .styl
    
    npm i css-loader style-loader url-loader file-loader stylus-loader stylus


# index.js 入口文件
    引用
    $mount挂在

# package.json 
    build:'cross-env NODE_ENV=production webpack --config webpack.config.js'
    dev:'cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js'

    webpack-dev-server cross-env html-webpack-plugin


    postcss-loader autoprefixer babel-loader babel-core

    babel-preset-env babel-plugin-transform-vue-jsx

