/*
 * @Author: 刁琪
 * @Date: 2019-11-05 19:23:33
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:52:52
 */
import Layout from '@/views/layout/Layout';

const purchasesManageRouter = {
  path: '/purchasesManage',
  component: Layout,
  redirect: 'noredirect',
  name: 'purchasesManage',
  meta: {
    title: 'purchasesManage',
    icon: 'purchasets',
    noCache: false
  },
  children: [
    {
      path: 'supplierManage',
      component: () => import('@/views/purchasesManage/supplierManage'),
      name: 'supplierManage',
      meta: {
        title: 'supplierManage',
        noCache: false
      }
    },
    {
      path: 'supplierEdit',
      component: () =>
      import(
        '@/views/purchasesManage/supplierManage/components/supplierEdit'
      ),
      name: 'supplierEdit',
      meta: {
        title: 'supplierEdit',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'supplierDetail/:id',
      component: () =>
      import(
        '@/views/purchasesManage/supplierManage/components/supplierDetail'
      ),
      name: 'supplierDetail',
      meta: {
        title: 'supplierDetail',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'purchasesList',
      component: () => import('@/views/purchasesManage/purchasesList'),
      name: 'purchasesList',
      meta: {
        title: 'purchasesList',
        noCache: true
      }
    },
    {
      path: 'purchasesList/newPurchase',
      component: () =>
      import('@/views/purchasesManage/purchasesList/components/newPurchase'),
      name: 'purchasesList/newPurchase',
      meta: {
        title: 'newPurchase',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'purchasesList/purchaseDetail/:purchaseId',
      component: () =>
      import(
        '@/views/purchasesManage/purchasesList/components/purchaseDetail'
      ),
      name: 'purchaseDetail',
      meta: {
        title: 'purchaseDetail',
        noCache: true
      },
      hidden: true
    }
  ]
};

export default purchasesManageRouter;
