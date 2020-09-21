/*
 * @Author: 刁琪
 * @Date: 2019-01-14 15:46:43
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 16:25:13
 */
import Layout from '@/views/layout/Layout'
const orderManageRouter = {
  path: '/orderManage',
  component: Layout,
  redirect: 'noredirect',
  name: 'orderManage',
  meta: {
    title: 'orderManage',
    icon: 'orderinfo'
  },
  children: [
    {
      path: 'orderList',
      component: () => import('@/views/ordersManage/orderlist'),
      name: 'orderList',
      meta: { title: 'orderList', noCache: true }
    },
    {
      path: 'orderDetail',
      component: () => import('@/views/ordersManage/orderlist/orderDetail.vue'),
      name: 'orderDetail',
      meta: {
        title: 'orderDetail',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'orderListCreat',
      component: () => import('@/views/ordersManage/orderlist/components/orderListCreat'),
      name: 'orderListCreat',
      meta: {
        title: 'orderListCreat',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'riskaControlAudit',
      component: () => import('@/views/ordersManage/riskaControlAudit'),
      name: 'riskaControlAudit',
      meta: { title: 'riskaControlAudit', noCache: true }
    },
    {
      path: 'riskaRule',
      component: () => import('@/views/ordersManage/riskaControlAudit/riskaRule.vue'),
      name: 'riskaRule',
      meta: { title: 'riskaRule', noCache: true },
      hidden: true
    },
    {
      path: 'riskDetail',
      component: () => import('@/views/ordersManage/riskaControlAudit/riskDetail.vue'),
      name: 'riskDetail',
      meta: { title: 'riskDetail', noCache: true },
      hidden: true
    },
    {
      path: 'assetSerialNumber',
      component: () => import('@/views/ordersManage/assetSerialNumber'),
      name: 'assetSerialNumber',
      meta: { title: 'assetSerialNumber', noCache: true }
    },
    {
      path: 'installmentWithholdingTrackin',
      component: () => import('@/views/ordersManage/installmentWithholdingTrackin'),
      name: 'installmentWithholdingTrackin',
      meta: { title: 'installmentWithholdingTrackin', noCache: true }
    },
    {
      path: 'dueAndReturnTracking',
      component: () => import('@/views/ordersManage/dueAndReturnTracking'),
      name: 'dueAndReturnTracking',
      meta: { title: 'dueAndReturnTracking', noCache: true }
    },
    {
      path: 'supplierOrders',
      component: () => import('@/views/ordersManage/supplierOrders'),
      name: 'supplierOrders',
      meta: { title: 'supplierOrders', noCache: true }
    },
    {
      path: 'abnormalOrders',
      component: () => import('@/views/ordersManage/abnormalOrders'),
      name: 'abnormalOrders',
      meta: { title: 'abnormalOrders', noCache: true }
    },
    // {
    //   path: 'enterpriseOrder',
    //   component: () => import('@/views/ordersManage/enterpriseOrder'),
    //   name: 'enterpriseOrder',
    //   meta: { title: '创建企业订单', noCache: true }
    // },
    {
      path: 'returnManagement',
      component: () => import('@/views/ordersManage/returnManagement'),
      name: 'returnManagement',
      meta: {
        title: 'returnManagement',
        noCache: true
      }
    },
    {
      path: 'returnManagement/returnOrdersDetail',
      component: () => import('@/views/ordersManage/returnManagement/returnOrdersDetail'),
      name: 'returnOrdersDetail',
      meta: {
        title: 'returnOrdersDetail',
        noCache: true
      },
      hidden: true
    },
    {
      path: 'returnConfirm',
      component: () => import('@/views/ordersManage/returnConfirm'),
      name: 'returnConfirm',
      meta: {
        title: 'returnConfirm',
        noCache: true
      }
    },
    {
      path: 'finacialApproval',
      component: () => import('@/views/ordersManage/finacialApproval'),
      name: 'finacialApproval',
      meta: {
        title: 'finacialApproval',
        noCache: true
      }
    }

  ]
}
export default orderManageRouter
