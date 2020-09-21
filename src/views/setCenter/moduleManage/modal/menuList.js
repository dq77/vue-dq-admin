import i18n from './../../../../lang'; // Internationalization
export default {
  parentMenuList: [
    {
      name: i18n.t('route.commodity'),
      path: '/commodity'
    },
    {
      name: i18n.t('route.orderManage'),
      path: '/orderManage'
    },
    {
      // 经纪人管理
      name: i18n.t('route.agentManage'),
      path: '/agentManage'
    },
    {
      // 房源管理
      name: i18n.t('route.houseManage'),
      path: '/houseManage'
    },
    {
      // 风格套餐管理
      name: i18n.t('route.housePackage'),
      path: '/housePackage'
    },
    {
      // 体验店管理
      name: i18n.t('route.modelroomManage'),
      path: '/modelroomManage'
    },
    {
      name: i18n.t('route.warehouseManage'),
      path: '/warehouseManage'
    },
    {
      name: i18n.t('route.purchasesManage'),
      path: '/purchasesManage'
    },
    {
      name: i18n.t('route.advertising'),
      path: '/advertising'
    },
    {
      name: i18n.t('route.memberManage'),
      path: '/member'
    },
    {
      name: i18n.t('route.setcenter'),
      path: '/setCenter'
    },
    {
      name: i18n.t('route.financialManagement'),
      path: '/financialManagement'
    }
  ],
  childMenuList: [
    {
      name: i18n.t('route.commodity'),
      path: '/commodity',
      children: [
        {
          name: i18n.t('route.category'),
          path: 'category'
        },
        {
          name: i18n.t('route.attribute'),
          path: 'attribute'
        },
        {
          name: i18n.t('route.brand'),
          path: 'brand'
        },
        {
          name: i18n.t('route.showCategory'),
          path: 'showCategory'
        },
        {
          name: i18n.t('route.freightSeting'),
          path: 'freightSeting'
        },
        {
          name: i18n.t('route.rentedGoods'),
          path: 'rent'
        }
      ]
    },
    {
      name: i18n.t('route.orderManage'),
      path: '/orderManage',
      children: [
        {
          name: i18n.t('route.orderList'),
          path: 'orderList'
        },
        {
          name: i18n.t('route.riskaControlAudit'),
          path: 'riskaControlAudit'
        },
        {
          name: i18n.t('route.returnManagement'),
          path: 'returnManagement'
        },
        {
          name: i18n.t('route.dueAndReturnTracking'),
          path: 'dueAndReturnTracking'
        },
        {
          name: i18n.t('route.returnConfirm'),
          path: 'returnConfirm'
        },
        {
          name: i18n.t('route.finacialApproval'),
          path: 'finacialApproval'
        }
      ]
    },
    {
      // 经纪人管理
      name: i18n.t('route.agentManage'),
      path: '/agentManage',
      children: [
        {
          path: 'agentList',
          name: i18n.t('route.agentList')
        },
        {
          path: 'agentDetail',
          name: i18n.t('route.agentDetail')
        },
        {
          path: 'commisionManage',
          name: i18n.t('route.commisionManage')
        }
      ]
    },
    {
      // 房源管理
      name: i18n.t('route.houseManage'),
      path: '/houseManage',
      children: [
        {
          path: 'houseList',
          name: i18n.t('route.houseList')
        },
        {
          path: 'houseDetail',
          name: i18n.t('route.houseDetail')
        }
      ]
    },
    {
      // 风格套餐管理
      name: i18n.t('route.housePackage'),
      path: '/housePackage',
      children: [
        {
          path: 'stylePackage',
          name: i18n.t('route.stylePackage')
        },
        {
          path: 'styleDetail',
          name: i18n.t('route.styleDetail')
        }
      ]
    },
    {
      // 体验店管理
      name: i18n.t('route.modelroomManage'),
      path: '/modelroomManage',
      children: [
        {
          path: 'feelroomList',
          name: i18n.t('route.feelroomList')
        },
        {
          path: 'feelroomDetail',
          name: i18n.t('route.feelroomDetail')
        }
      ]
    },
    {
      name: i18n.t('route.warehouseManage'),
      path: '/warehouseManage',
      children: [
        {
          name: i18n.t('route.stockManage'),
          path: 'stockManage'
        },
        {
          name: i18n.t('route.inventoryManag'),
          path: 'inventoryManag'
        },
        {
          name: i18n.t('route.meanManage'),
          path: 'meanManage'
        },
        {
          name: i18n.t('route.instockManage'),
          path: 'instockManage'
        },
        {
          name: i18n.t('route.outstockManage'),
          path: 'outstockManage'
        }
      ]
    },
    {
      name: i18n.t('route.financialManagement'),
      path: '/financialManagement',
      children: [
        {
          path: 'manualSettlement',
          name: i18n.t('route.manualSettlement')
        },
        {
          path: 'purchaseSettlement',
          name: i18n.t('route.purchaseSettlement')
        },
        {
          path: 'openPlatformSettlement',
          name: i18n.t('route.openPlatformSettlement')
        },
        {
          path: 'generationSettlement',
          name: i18n.t('route.generationSettlement')
        }
      ]
    },
    {
      name: i18n.t('route.purchasesManage'),
      path: '/purchasesManage',
      children: [
        {
          name: i18n.t('route.supplierManage'),
          path: 'supplierManage'
        },
        {
          name: i18n.t('route.purchasesList'),
          path: 'purchasesList'
        }
      ]
    },
    {
      name: i18n.t('route.advertising'),
      path: '/advertising',
      children: [
        {
          name: i18n.t('route.generalizeModal'),
          path: 'generalizeModal'
        },
        {
          name: i18n.t('route.bannerlist'),
          path: 'bannerlist'
        },
        {
          name: i18n.t('route.appWelcome'),
          path: 'app'
        },
        {
          name: i18n.t('route.choiceGoods'),
          path: 'choiceGoods'
        },
        {
          name: i18n.t('route.homeNavigation'),
          path: 'homeNavigation'
        }
      ]
    },
    {
      name: i18n.t('route.memberManage'),
      path: '/member',
      children: [
        {
          name: i18n.t('route.memberUser'),
          path: 'memberUser'
        },
        {
          name: i18n.t('route.feedBack'),
          path: 'feedBack'
        }
      ]
    },
    {
      name: i18n.t('route.setcenter'),
      path: '/setCenter',
      children: [
        {
          name: i18n.t('route.userManage'),
          path: 'userManage'
        },
        {
          name: i18n.t('route.roleManage'),
          path: 'roleManage'
        },
        {
          name: i18n.t('route.moduleManage'),
          path: 'moduleManage'
        }
      ]
    }
  ]
};
