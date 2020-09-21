// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// const BASE_URL = 'http://greentown-hangzhou-daily.oss-cn-hangzhou.aliyuncs.com/web/'
// const BASE_URL = 'http://106.14.15.55:8080'

'use strict';
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 9527; // TODO: change to Settings

// 代理
const devProxy = [
  '/goods',
  '/auth_info',
  '/message',
  '/users',
  '/api',
  '/orders',
  '/admin',
  '/background',
  '/bill',
  '/refund',
  '/risk/',
  '/order/',
  '/coupon/',
  '/promotions/',
  '/erp',
  '/pay_back',
  '/partner/',
  'balance',
  'management',
  '/v1'
];
// const devProxy = ['/taozugong'];
// 生成代理配置对象
const proxyObj = {};
// const URL = 'https://usa.service.taozugong.com'
const URL = 'https://usa.api.taozugong.cn';
// const URL = 'https://api.taozugong.cn';
// const URL = 'http://10.5.0.32:9090'
// const URL = 'http://10.5.0.231:9192'
devProxy.forEach((value, index) => {
  let target = '';
  switch (value) {
    case '/admin':
      // target = 'http://10.5.0.243:9090';
      target = URL;
      break;
    case '/users':
      // target = 'http://10.5.0.231:9090';
      target = URL;
      break;
    case '/v1':
      // target = 'http://10.5.0.47:8088';
      target = URL;
      break;
    default:
      target = URL;
  }
  console.log(value);
  proxyObj[value] = {
    // target: 'https://api.tzozugong.cn/api',
    target: target,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      [`^${value}`]: value === '/taozugong' ? '/' : value
    }
  };
});

console.log('代理地址', devProxy);
console.log('当前的打包或运行环境', process.env.NODE_ENV);
console.log('当前代理地址', proxyObj);

// Explanation of each configuration item You can find it in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You can set by yourself according to actual condition
   * You will need to set this if you plan to deploy your site under a sub path,
   * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then assetsPublicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail https://cli.vuejs.org/config/#baseurl
   */
  // baseUrl: '/',
  baseUrl: process.env.VUE_APP_BASE_URL,
  // outputDir: 'dist',
  outputDir: process.env.NODE_ENV === 'alpha' ? 'alpha_dist' : 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: proxyObj, // string | Object
    after(app) {
      console.log('apple');
      const bodyParser = require('body-parser');
      require('@babel/register');
      // parse app.body
      // http://expressjs.com/en/4x/api.html#req.body
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
    }
  },
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: 'vue-taozugong-admin', // TODO: change to Settings
    // 关闭 webpack 的性能提示
    performance: {
      hints: false
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('cheap-source-map')
    );

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ]);
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          elementUI: {
            name: 'chunk-elementUI', // 单独将 elementUI 拆包
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]element-ui[\\/]/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // 可自定义拓展你的规则
            minChunks: 3, // 最小公用次数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single');
    });
  }
};
