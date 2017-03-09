// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './style.styl'

import Breadcrumb from './components/breadcrumb'
import Mock from './mock'
import App from './app.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)
Mock.bootstrap()
// register dashboard components
Vue.component('db-breadcrumb', Breadcrumb)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
