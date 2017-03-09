import Vue from 'vue'
import VueRouter from 'vue-router'
import Abstract from '@/pages/common/abstract'
import NotFound from '@/pages/common/404'

// list with filters page
import ListWithFilters from '@/pages/list/with-filters'
import BigForm from '@/pages/form/big-form'
import Home from '@/pages/home'
import Login from '@/pages/login'
import chart from '@/pages/chart'
import play from '@/pages/play'

Vue.use(VueRouter)
/*const root = Vue.component('root', {
  template: '<router-view></router-view>'
})*/

let routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        component: Abstract,
        name: '列表',
        iconClass: 'el-icon-message',
        children: [
          {
            path: 'filters',
            name: '搜索条件',
            component: ListWithFilters,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'form',
        component: Abstract,
        name: '表单',
        iconClass: 'el-icon-document',
        children: [
          {
            path: 'big-form',
            name: '简历管理',
            component: BigForm,
            imgUrl: 'https://o0p2g4ul8.qnssl.com/vsite%2Fbackground.jpg'
          }
        ]
      },
      {
        path: 'chart',
        component: chart,
        name: '图表',
        iconClass: 'el-icon-document'
       
      },
      {
        path: 'play',
        component: play,
        name: '视频播放',
        iconClass: 'el-icon-document'
      }
    ]
  },
  {
    path: '*',
    redirect: {path: '/404'}
  }
]
let menuCount = routes.length;
routes[menuCount - 2].children.forEach(route => {
  if (route.children) {
    if (!route.meta) route.meta = {};
    route.meta.children = route.children;
  }
})
let router = new VueRouter({
  routes,
  mode: 'hash',
  linkActiveClass: 'active'
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      next({path: '/login', query: {redirect: to.fullPath}});
    }
  }
  next();
})
export default router
