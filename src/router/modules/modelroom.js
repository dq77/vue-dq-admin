/*
 * @Author: 刁琪
 * @Date: 2020-02-05 19:23:33
 * @LastEditors: 刁琪
 * @LastEditTime: 2020-02-06 15:52:52
 */
import Layout from '@/views/layout/Layout'

const modelRoomRouter = {
  path: '/modelroomManage',
  component: Layout,
  redirect: 'noredirect',
  // name: 'modelroomManage',
  meta: {
    title: 'modelroomManage',
    icon: 'modelroomManage',
    noCache: false
  },
  children: [{
    path: 'feelroomList',
    component: () => import('@/views/modelroomManage/feelroomList'),
    name: 'feelroomList',
    meta: {
      title: 'feelroomList',
      noCache: false
    }
  }, {
    path: 'feelroomDetail',
    component: () => import('@/views/modelroomManage/feelroomList/components/add'),
    name: 'feelroomDetail',
    meta: {
      title: 'feelroomDetail',
      noCache: true
    },
    hidden: true
  }]
}

export default modelRoomRouter

