const path = require("path")
function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 9527 // dev port
module.exports = {
  lintOnSave: false, // 关闭语法检查
  // 基本路径,相对路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }, proxy: {
      // http://c.m.163.com/nc/article/headline/T1348647853363/0-40.html
      '/navigation': { // 请求相对路径以/api开头的, 才会走这里的配置
        target: ' https://mock.mengxuegu.com/mock/629492786163854a32e82636', // 后台接口域名 我们要代理的真实的接口地址
        changeOrigin: true, // 改变请求来源(欺骗后台你的请求是从http://c.m.163.com)
        pathRewrite: {
          '^/navigation': '' // 因为真实路径中并没有/api这段, 所以要去掉这段才能拼接正确地址转发请求
        }
      }
    }
  },
  // 配置绝对路径
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },

  chainWebpack (config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
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
      .end()
    config
      .optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    config.optimization.runtimeChunk('single')
  }
}