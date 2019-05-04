module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '하와와',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '하와와 커뮤니티' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#f78989' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['vuex', 'socket.io-client', 'element-ui'],
  },
  plugins: [
    '~plugins/socket.io.js',
    '~plugins/element-ui',
    {
      src: '~plugins/quill.js',
      ssr: false
    },
  ],
  css: [
    '~assets/main.css',
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css'
  ],
  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['@nuxtjs/moment', ['ko']],
    'nuxt-fontawesome'
  ],
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  proxy: {
    '/api': 'http://localhost:3000',
  },
  env: {
    SOCKET_HOST_URL: process.env.SOCKET_HOST_URL || 'http://localhost:3000'
  },
  configureWebpack: {
    output: {
      globalObject: 'this',
    },
  },
}