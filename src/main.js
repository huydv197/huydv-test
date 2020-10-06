import Vue from 'vue'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
// import * as filters from './filters' // global filters
import { registerBaseComponents } from '@/utils/globals'

registerBaseComponents(Vue)

// register global utility filters
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
