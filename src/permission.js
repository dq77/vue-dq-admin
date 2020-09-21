import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import * as Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false })// NProgress Configuration

//  进入路由前 进行
// function hasPermission(routerlist, roles, path) {
//   console.log('前往路由:', path);
//   console.log('当前账户所属路由:', routerlist)
//   const rolesArr = filtersuperAdmin(roles)
//   if (rolesArr.includes('superadmin')) {
//     return true
//   } else {
//     return filterPath(path, routerlist)
//   }
// }

// function filterPath(path, routerlist) {
//   var flag = false
//   routerlist.map(item => {
//     if (item.path === path) {
//       flag = true
//     }
//   })
//   return flag
// }

// function filtersuperAdmin(roles) {
//   const arr = []
//   roles.map(item => {
//     arr.push(item.role)
//   })
//   return arr
// }

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否请求过获取账户信息的接口
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          store.dispatch('GenerateRoutes', res.data).then(() => { // 根据roles权限生成可访问的路由表
            console.log('用户可以访问的路由', store.getters.addRouters);
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 判断用户进入的路由界面是否在符合该账户的权限
        // if (hasPermission(store.getters.routerList, store.getters.roles, to.path)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        next()
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
