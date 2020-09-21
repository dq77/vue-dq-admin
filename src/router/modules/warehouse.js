/*
 * @Author: 刁琪
 * @Date: 2019-11-05 19:23:33
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:52:52
 */
import Layout from '@/views/layout/Layout'

const warehouseManageRouter = {
  path: '/warehouseManage',
  component: Layout,
  redirect: 'noredirect',
  name: 'warehouseManage',
  meta: {
    title: 'warehouseManage',
    icon: 'warehouseManage',
    noCache: false
  },
  children: [{
    path: 'stockManage',
    component: () => import('@/views/warehouseManage/stockManage'),
    name: 'stockManage',
    meta: {
      title: 'stockManage',
      noCache: false
    }
  }, {
    path: 'inventoryManag',
    component: () => import('@/views/warehouseManage/inventoryManag'),
    name: 'inventoryManag',
    meta: {
      title: 'inventoryManag',
      noCache: true
    }
  }, {
    path: 'meanManage',
    component: () => import('@/views/warehouseManage/meanManage'),
    name: 'meanManage',
    meta: {
      title: 'meanManage',
      noCache: true
    }
  }, {
    path: 'meanDetail/:sn',
    component: () => import('@/views/warehouseManage/meanManage/meanDetail'),
    name: 'meanDetail',
    meta: {
      title: 'meanDetail',
      noCache: true
    },
    hidden: true
  }, {
    path: 'instockManage',
    component: () => import('@/views/warehouseManage/instockManage'),
    name: 'instockManage',
    meta: {
      title: 'instockManage',
      noCache: true
    }
  }, {
    path: 'instockDetail',
    component: () => import('@/views/warehouseManage/instockManage/components/detail'),
    name: 'instockDetail',
    meta: {
      title: 'instockDetail',
      noCache: true
    },
    hidden: true
  }, {
    path: 'createInstock',
    component: () => import('@/views/warehouseManage/instockManage/components/createInstock'),
    name: 'createInstock',
    meta: {
      title: 'createInstock',
      noCache: true
    },
    hidden: true
  }, {
    path: 'outstockManage',
    component: () => import('@/views/warehouseManage/outstockManage'),
    name: 'outstockManage',
    meta: {
      title: 'outstockManage',
      noCache: true
    }
  }, {
    path: 'outstockDetail',
    component: () => import('@/views/warehouseManage/outstockManage/components/detail'),
    name: 'outstockDetail',
    meta: {
      title: 'outstockDetail',
      noCache: true
    },
    hidden: true
  }, {
    path: 'createOutstock',
    component: () => import('@/views/warehouseManage/outstockManage/components/createOutstock'),
    name: 'createOutstock',
    meta: {
      title: 'createOutstock',
      noCache: true
    },
    hidden: true
  }]
}

export default warehouseManageRouter

