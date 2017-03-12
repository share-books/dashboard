// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueSocketio from 'vue-socket.io'
import Breadcrumb from './components/Breadcrumb'
import Mock from './mock'
import App from './app.vue'
import router from './router'
import store from './store'
import { currency } from './currency'
import { Option } from './resources/option'
Vue.filter('currency', currency)
Vue.config.productionTip = false
Vue.use(ElementUI)
Mock.bootstrap()
// register dashboard components
Vue.component('db-breadcrumb', Breadcrumb)

Vue.use(VueSocketio, Option.WebServer)
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

/*
 "babel": {
      "presets": [
        "@ava/stage-4",
        "@ava/transform-test-files"
      ]
    },
*/