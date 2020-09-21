/*
 * @Author: 刁琪
 * @Date: 2020-03-06 16:21:15
 * @LastEditors: わからないよう
 */ 
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const goodsRouter = {
  path: '/commodity',
  component: Layout,
  redirect: 'noredirect',
  name: 'Goods',
  meta: {
    title: 'commodity',
    icon: 'shopping'
  },
  children: [
    {
      path: 'category',
      component: () => import('@/views/goods/categories'),
      name: 'goodCategories',
      meta: { title: 'category', noCache: true }
    },
    {
      path: 'attribute',
      component: () => import('@/views/goods/attributes'),
      name: 'goodAttributes',
      meta: { title: 'attribute', noCache: true }
    },
    {
      path: 'brand',
      component: () => import('@/views/goods/brands'),
      name: 'goodBrand',
      meta: { title: 'brand', noCache: true }
    },
    {
      path: 'showCategory',
      component: () => import('@/views/goods/showCategory'),
      name: 'showCategory',
      meta: { title: 'showCategory', noCache: true }
    },
    {
      path: 'freightSeting',
      component: () => import('@/views/goods/freight/index'),
      name: 'freightSeting',
      meta: {
        title: 'freightSeting',
        // icon: 'setcenter',
        noCache: true
      }
    },
    {
      path: 'rent',
      component: () => import('@/views/goods/index'),
      name: 'rentedGoods',
      meta: { title: 'rentedGoods', noCache: true }
    },
    {
      path: 'addGoods',
      component: () => import('@/views/goods/AddGoods.vue'),
      name: 'addGoods',
      meta: { title: 'addGoods', noCache: true },
      hidden: true
    },
    {
      path: 'goodsDetail',
      component: () => import('@/views/goods/goodsDetail.vue'),
      name: 'goodsDetail',
      meta: { title: 'goodsDetail', noCache: true },
      hidden: true
    }
  ]
}

export default goodsRouter
