/*
 * @Author: 刁琪
 * @Date: 2019-01-10 19:23:33
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 15:52:52
 */
import Layout from '@/views/layout/Layout'

const setCenterRouter = {
  path: '/setCenter',
  component: Layout,
  redirect: 'noredirect',
  name: 'setcenter',
  meta: {
    title: 'setcenter',
    icon: 'setcenter',
    noCache: false
  },
  children: [{
    path: 'userManage',
    component: () => import('@/views/setCenter/userManage'),
    name: 'userManage',
    meta: {
      title: 'userManage',
      noCache: false
    }
  }, {
    path: 'roleManage',
    component: () => import('@/views/setCenter/roleManage'),
    name: 'roleManage',
    meta: {
      title: 'roleManage',
      noCache: true
    }
  }, {
    path: 'moduleManage',
    component: () => import('@/views//setCenter/moduleManage'),
    name: 'moduleManage',
    meta: {
      title: 'moduleManage',
      noCache: true
    }
  }]
}

export default setCenterRouter

