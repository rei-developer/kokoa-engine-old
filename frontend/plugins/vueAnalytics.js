import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

export default (ctx, inject) => {
  Vue.use(VueAnalytics, {
    id: 'UA-127341158-2',
    checkDuplicatedScript: true,
    debug: {
      enabled: false,
      trace: false,
      sendHitTask: process.env.NODE_ENV === 'production'
    },
    router: ctx.app.router
  })

  ctx.$ga = Vue.$ga
  inject('ga', Vue.$ga)
}