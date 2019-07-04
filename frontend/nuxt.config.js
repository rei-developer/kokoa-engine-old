module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '아이돌보드',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no' },
      { name: 'theme-color', content: '#29313D' },
      { name: 'google-site-verification', content: 'BEmhl96CsIh9rlpvLSKMLLjHOccJrj6VnMdtMjd8Nbk' },
      { hid: 'description', name: 'description', content: '아이돌보드 - K-POP, 프로듀스48, 프로듀스101, 프로미스나인, 아이즈원, 버스터즈' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#409EFF' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
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
    '~/plugins/socket.io.js',
    '~/plugins/element-ui',
    { src: '~/plugins/quill.js', ssr: false },
    { src: '~/plugins/chart', ssr: false },
  ],
  css: [
    '~/assets/main.css',
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css'
  ],
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    '@nuxtjs/bulma',
    ['@nuxtjs/google-adsense'],
    ['@nuxtjs/moment', ['ko']],
    'nuxt-fontawesome',
    'nuxt-clipboard2'
  ],
  'google-adsense': {
    id: 'ca-pub-5633529273423665'
  },
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      }
    ]
  },
  axios: {
    proxy: true
  },
  proxy: {
    '/api': 'http://localhost:8000'
  },
  env: {
    SOCKET_HOST_URL: 'https://idolboard.com'
  },
  configureWebpack: {
    output: {
      globalObject: 'this',
    },
  },
}