/*
 * @Author: 刁琪
 * @Date: 2019-01-19 09:47:57
 * @LastEditors: your name
 * @LastEditTime: 2019-04-22 14:23:13
 */
import Layout from '@/views/layout/Layout'

const advertisingRouter = {
  path: '/advertising',
  component: Layout,
  redirect: 'noredirect',
  name: 'advertising',
  meta: {
    title: 'advertising',
    icon: 'ad'
  },
  children: [
    {
      path: 'generalizeModal',
      component: () => import('@/views/advertising/popup/index.vue'),
      name: 'generalizeModal',
      meta: { title: 'generalizeModal', noCache: true }
    },
    {
      path: 'bannerlist',
      component: () => import('@/views/advertising/banner/index.vue'),
      name: 'bannerlist',
      meta: { title: 'bannerlist', noCache: true }
    },
    {
      path: 'app',
      component: () => import('@/views/advertising/appWelcome'),
      name: 'app',
      meta: {
        title: 'appWelcome',
        noCache: true
      }
    },
    {
      path: 'choiceGoods',
      component: () => import('@/views/advertising/choiceGoods'),
      name: 'choice',
      meta: {
        title: 'choiceGoods',
        noCache: true
      }
    },
    {
      path: 'homeNavigation',
      component: () => import('@/views/advertising/homeNavigation'),
      name: 'homeNavigation',
      meta: {
        title: 'homeNavigation',
        noCache: true
      }
    }
  ]

}
export default advertisingRouter
