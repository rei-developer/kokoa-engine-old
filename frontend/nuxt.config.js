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
      { name: 'google-site-verification', content: 'BxPxwI8rlJTdR-pDX9EMgegVSy0dNLjXvgQLuRk8D5I' },
      { hid: 'description', name: 'description', content: '아이돌보드 - K-POP, ITZY, 트와이스, 프로듀스48, 프로듀스101, 프로미스나인, 아이즈원, 버스터즈' }
    ],
    script: [
      {
        src: 'https://www.google.com/recaptcha/api.js?render=6LfBJb0UAAAAALwYlKcwBwVK2kvCm-sY5shrYI1I'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#25c6ff' },
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
    '~/plugins/element-ui.js',
    '~/plugins/socket.io.js',
    { src: '~/plugins/chart.js', ssr: false },
    { src: '~/plugins/quill.js', ssr: false },
    { src: '~/plugins/vue-masonry-css.js', ssr: false }
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
    ['@nuxtjs/recaptcha',{
      hideBadge: true,
      siteKey: '6LfBJb0UAAAAALwYlKcwBwVK2kvCm-sY5shrYI1I',
      version: 3
    }],
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