/*
 * @Author: 刁琪
 * @Date: 2020-02-05 19:23:33
 * @LastEditors: 刁琪
 * @LastEditTime: 2020-02-06 15:52:52
 */
import Layout from '@/views/layout/Layout'

const houseRouter = {
  path: '/houseManage',
  component: Layout,
  redirect: 'noredirect',
  // name: 'houseManage',
  meta: {
    title: 'houseManage',
    icon: 'houseManage',
    noCache: false
  },
  children: [{
    path: 'houseList',
    component: () => import('@/views/houseManage/houseList'),
    name: 'houseList',
    meta: {
      title: 'houseList',
      noCache: false
    }
  }, {
    path: 'houseDetail',
    component: () => import('@/views/houseManage/houseList/components/add'),
    name: 'houseDetail',
    meta: {
      title: 'houseDetail',
      noCache: true
    },
    hidden: true
  }]
}

export default houseRouter

