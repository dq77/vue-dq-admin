import Layout from '@/views/layout/Layout';

const financialManageRouter = {
  path: '/financialManagement',
  component: Layout,
  redirect: 'noredirect',
  name: 'financialManage',
  meta: {
    title: 'financialManagement',
    icon: 'priceMag',
    noCache: false
  },
  children: [
    {
      path: 'manualSettlement',
      component: () => import('@/views/financialManagement/manualSettlement'),
      name: 'manualSettlement',
      meta: {
        title: '手工建单结算',
        noCache: false
      }
    },
    {
      path: 'purchaseSettlement',
      component: () => import('@/views/financialManagement/purchaseSettlement'),
      name: 'purchaseSettlement',
      meta: {
        title: 'purchaseSettlement',
        noCache: false
      }
    },
    {
      path: 'openPlatformSettlement',
      component: () =>
        import('@/views/financialManagement/openPlatformSettlement'),
      name: 'openPlatformSettlement',
      meta: {
        title: '开放平台结算',
        noCache: false
      }
    },
    {
      path: 'openPlatformSettlement/settlementDetail/:id',
      component: () =>
        import('@/views/financialManagement/model/settlementDetail'),
      name: 'openPlatformSettlement/settlementDetail',
      meta: {
        title: '查看',
        noCache: false
      },
      hidden: true
    },
    {
      path: 'generationSettlement',
      component: () =>
        import('@/views/financialManagement/generationSettlement'),
      name: 'generationSettlement',
      meta: {
        title: '代发结算',
        noCache: false
      }
    }
  ]
};

export default financialManageRouter;
