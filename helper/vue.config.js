module.exports = {
  devServer:{
    proxy:{
      '^/api': {
        target: 'http://localhost:2021',
        changeOrigin: true,
        secure:false,
        pathRewrite: {'^/api': '/api'},
        logLevel: 'debug' 
      },
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}
