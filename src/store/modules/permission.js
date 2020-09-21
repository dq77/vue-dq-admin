import { asyncRouterMap, constantRouterMap } from '@/router'
import { getRouterList } from '@/utils/auth'

// /**
//  * 通过meta.role判断是否与当前用户权限匹配
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// /**
//  * 递归过滤异步路由表，返回符合用户角色权限的路由表
//  * @param routes asyncRouterMap
//  * @param roles
//  */
// function filterAsyncRouter(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

function haschildren(routerlistChildren, routerChildren) {
  const newarr = []
  routerlistChildren.map(tmp => {
    routerChildren.map(route => {
      if (tmp.path === route.path) {
        newarr.push(route)
      // } else if (route.hidden) {
      //   newarr.push(route)
      }
    })
  })
  // 新增五行 上面注释内容
  routerChildren.map(route => {
    if (route.hidden) {
      newarr.push(route)
    }
  })
  return newarr
}

/**
 * 对照后台返回的路由表,显示对应的路由
 * @param {*} router // 前端定义的路由表
 * @param {*} routerList // 后端根据用户信息返回的路由表
 */

function filtrateAsynvRouter(router, routerlist) {
  const arr = []
  console.log('router: ', router, 'routerList: ', routerlist);
  routerlist.map(one => {
    router.map(item => {
      if (one.path === item.path && (one.children && one.children.length > 0) && (item.children && item.children.length > 0)) {
        item.children = haschildren(one.children, item.children)
        arr.push(item)
      // } else if (item.path === '*') { // 当输入不存在路由时跳转404
      //   arr.push(item)
      }
    })
  })
  // 新增一行 上面注释内容
  arr.push({ path: '*', redirect: '/404', hidden: true })
  console.log('路由', arr);
  return arr
}

/**
 * 处理后台返回的roles是否有超级管理员角色
 */
function filtersuperAdmin(roles) {
  const arr = []
  roles.map(item => {
    arr.push(item.role)
  })
  return arr
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    routerList: getRouterList()
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const roles = filtersuperAdmin(data.roles)
        // 修改一行变三行 过滤后再赋值 而不是直接赋值
        const routerlist = data.routerlist.filter(item => {
          return item.parent === null
        })
        let accessedRouters
        if (roles.includes('superadmin')) { // 如果是管理员 所有模块可见
          accessedRouters = asyncRouterMap
        } else {
          const router = filtrateAsynvRouter(asyncRouterMap, routerlist)
          accessedRouters = router
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
