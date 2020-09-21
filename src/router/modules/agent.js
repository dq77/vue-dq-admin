/*
 * @Author: 刁琪
 * @Date: 2020-02-05 19:23:33
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-07-30 11:26:46
 */
import Layout from '@/views/layout/Layout'

const agentManageRouter = {
  path: '/agentManage',
  component: Layout,
  redirect: 'noredirect',
  name: 'agentManage',
  meta: {
    title: 'agentManage',
    icon: 'agentManage',
    noCache: false
  },
  children: [{
    path: 'agentList',
    component: () => import('@/views/agentManage/agentList'),
    name: 'agentList',
    meta: {
      title: 'agentList',
      noCache: false
    }
  }, {
    path: 'agentDetail',
    component: () => import('@/views/agentManage/agentList/components/add'),
    name: 'agentDetail',
    meta: {
      title: 'agentDetail',
      noCache: true
    },
    hidden: true
  }, {
    path: 'commisionManage',
    component: () => import('@/views/agentManage/commisionManage'),
    name: 'commisionManage',
    meta: {
      title: 'commisionManage',
      noCache: false
    }
  }]
}

export default agentManageRouter

