/*
 * @Author: 刁琪
 * @Date: 2019-01-08 15:57:29
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-07-29 16:24:17
 */
import Layout from '@/views/layout/Layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: 'noredirect',
  name: 'Member',
  meta: {
    title: 'memberManage',
    icon: 'peoples',
    noCache: false
  },
  children: [{
    path: 'memberUser',
    component: () => import('@/views/memberManagement'),
    name: 'memberUser',
    meta: {
      title: 'memberUser',
      noCache: false
    }
  }, {
    path: 'memberUser/memberInfo/:id',
    component: () => import('@/views/memberManagement/memberDetail'),
    name: 'memberinfo',
    meta: { title: 'memberinfo', noCache: true },
    hidden: true
  },
  {
    path: 'feedBack',
    component: () => import('@/views/feedback/index'),
    name: 'feedBack',
    meta: {
      title: 'feedBack',
      noCache: true
    }
  }]
}

export default memberRouter
