import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/views/layout/Layout';

/* Router Modules */
// import tableRouter from './modules/table'

import goodsRputer from './modules/goods';
import agentManageRouter from './modules/agent' // 经纪人管理
import modelRoomRouter from './modules/modelroom' // 样板间管理
import houseRouter from './modules/house' // 房源管理
import houseStyleRouter from './modules/houseStyle' // 房屋风格管理
import memberRouter from './modules/member'; // 会员管理
import warehouseManageRouter from './modules/warehouse'; // 仓储管理
import purchasesManageRouter from './modules/purchases'; // 采购管理
import setCenterRouter from './modules/setCenter'; // 设置中心
import orderManageRouter from './modules/orders'; // 订单详情
import advertisingRouter from './modules/advertising'; // 广告位推广
// import fixedReturn from './modules/fiexdReturn';
import financialManagement from './modules/financialManagement';
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
];

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  goodsRputer,
  orderManageRouter, // 订单
  agentManageRouter, // 经纪人管理
  modelRoomRouter, // 样板间管理
  houseRouter, // 房源管理
  houseStyleRouter, // 房屋风格管理
  warehouseManageRouter, // 仓储管理
  purchasesManageRouter, // 采购管理
  financialManagement, // 财务管理
  // fixedReturn,
  advertisingRouter, // 广告
  memberRouter, // 会员列表
  setCenterRouter, // 设置中心
  { path: '*', redirect: '/404', hidden: true }
];
