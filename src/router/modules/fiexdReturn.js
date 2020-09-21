
import Layout from '@/views/layout/Layout'

export default {
  path: '/fixedReturnCash',
  component: Layout,
  meta: {
    title: 'fixedReturnCash',
    icon: 'ad',
    noCache: true
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/fixed_return_cash'),
      name: 'fixedReturnCash',
      meta: {
        title: 'fixedReturnCash',
        icon: 'ad',
        noCache: true
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/fixed_return_cash/components/add'),
      name: 'fixedReturnEdit',
      meta: {
        title: 'fixedReturnEdit',
        icon: 'ad',
        noCache: true
      },
      hidden: true
    }
  ]

}
