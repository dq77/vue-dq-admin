/*
 * @Author: 刁琪
 * @Date: 2020-02-05 19:23:33
 * @LastEditors: 刁琪
 * @LastEditTime: 2020-02-06 15:52:52
 */
import Layout from '@/views/layout/Layout'

const houseRouter = {
  path: '/housePackage',
  component: Layout,
  redirect: 'noredirect',
  name: 'housePackage',
  meta: {
    title: 'housePackage',
    icon: 'housePackage',
    noCache: false
  },
  children: [{
    path: 'stylePackage',
    component: () => import('@/views/housePackage/stylePackage'),
    name: 'stylePackage',
    meta: {
      title: 'stylePackage',
      noCache: false
    }
  }, {
    path: 'styleDetail',
    component: () => import('@/views/housePackage/stylePackage/components/add'),
    name: 'styleDetail',
    meta: {
      title: 'styleDetail',
      noCache: true
    },
    hidden: true
  }]
}

export default houseRouter

