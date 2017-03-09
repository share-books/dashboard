// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
	import VueSocketio from 'vue-socket.io'


import Breadcrumb from './components/breadcrumb'
import Mock from './mock'
import App from './app.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)
Mock.bootstrap()
// register dashboard components
Vue.component('db-breadcrumb', Breadcrumb)
	Vue.use(VueSocketio, 'http://localhost:3000')
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
