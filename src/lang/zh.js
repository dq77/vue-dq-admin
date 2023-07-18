export default {
  // 左侧导航目录
  route: {
    dashboard: '首页',
    commodity: '商品管理',
    category: '类目管理',
    attribute: '属性管理',
    brand: '品牌管理',
    showCategory: '前台类目',
    freightSeting: '运费税费',
    rentedGoods: '商品管理',
    addGoods: '新增租用商品',
    goodsDetail: '商品详情',
    orderManage: '订单管理',
    orderList: '订单列表',
    orderDetail: '订单详情',
    orderListCreat: '手动建单',
    riskaControlAudit: '风控审核',
    riskaRule: '风控规则',
    riskDetail: '风控订单详情',
    assetSerialNumber: '资产序列号绑定',
    installmentWithholdingTrackin: '分期代扣跟踪',
    dueAndReturnTracking: '到期归还跟踪',
    supplierOrders: '供应商发货订单',
    abnormalOrders: '订单异常处理',
    returnManagement: '退货订单',
    returnOrdersDetail: '退货单详情',
    returnConfirm: '退货回仓确认',
    finacialApproval: '财务审核',
    agentManage: '经纪人',
    agentList: '经纪人管理',
    agentDetail: '经纪人编辑',
    commisionManage: '佣金管理',
    modelroomManage: '样板间管理',
    feelroomList: '体验门店管理',
    feelroomDetail: '体验门店编辑',
    houseManage: '房源管理',
    houseList: '房源列表',
    houseDetail: '房源详情',
    housePackage: '风格套餐管理',
    stylePackage: '风格套餐',
    styleDetail: '风格套餐详情',
    warehouseManage: '仓储管理',
    stockManage: '仓库管理',
    inventoryManag: '库存管理',
    meanManage: '资产管理',
    meanDetail: '资产详情',
    instockManage: '入库管理',
    instockDetail: '入库单详情',
    createInstock: '新增入库单',
    outstockManage: '出库管理',
    outstockDetail: '出库单详情',
    createOutstock: '新增出库单',
    advertising: '资源位配置',
    generalizeModal: '首页弹窗',
    bannerlist: '首页banner',
    appWelcome: 'app欢迎页',
    choiceGoods: '精选速递',
    homeNavigation: '首页导航',
    coupons: '优惠劵',
    couponsdetail: '优惠劵配置',
    memberManage: '会员管理',
    memberUser: '会员列表',
    memberinfo: '会员详情',
    feedBack: '意见反馈',
    setcenter: '权限管理',
    userManage: '用户列表',
    roleManage: '角色管理',
    moduleManage: '菜单管理',
    financialManagement: '财务管理',
    manualSettlement: '手工建单结算',
    purchaseSettlement: '采购结算',
    openPlatformSettlement: '开放平台结算',
    generationSettlement: '代发结算',
    purchasesManage: '采购管理',
    supplierManage: '供应商管理',
    purchasesList: '采购订单',
    supplierEdit: '供应商编辑',
    supplierDetail: '供应商详情',
    newPurchase: '新增采购',
    purchaseDetail: '采购详情'
  },
  navbar: {
    logOut: '退出登录',
    changePassword: '修改密码',
    screenfull: '全屏',
    changeLang: '语言切换成功'
  },
  login: {
    title: '小公公租赁管理系统',
    logIn: '登录',
    plzUsername: '请输入用户名',
    plzPassword: '请输入密码',
    longUser: '用户名格式不正确',
    pwdShort: '密码长度不能小于6位'
  },
  // 商品管理
  good: {
    // 类目管理
    categoryName: '类目名称',
    addCategory: '新增类目',
    iptCategoryName: '请输入类目名称',
    commissionRate: '设置返佣比例',
    rangecommission: '比例范围0.1-0.99',
    showlog: '查看日志',
    checkiptCommission: '请输入返佣比例',
    checkiptnum: '请输入数字',
    categoryid: '类目编号',
    editcategory: '编辑类目',
    delcategorytip: '此操作将永久删除该类目, 是否继续?',
    addprop: '新增属性',
    actionTime: '操作时间',
    actionContent: '操作内容',
    actionUser: '操作人',
    // 属性管理
    propName: '属性名称',
    iptpropName: '请输入属性名称',
    propValue: '属性值',
    addpropValue: '新增属性值',
    editprop: '编辑属性',
    delproptips: '此操作将永久删除该属性, 是否继续?',
    addpropplz: '请添加属性值',
    propnotrepeat: '属性值不能重复！',
    // 品牌管理
    brandName: '品牌名称',
    iptbrandName: '请输入品牌名称',
    addbrand: '新增品牌',
    englishName: '英文名称',
    iptenglishName: '请输入英文名称',
    brandslogan: '品牌标语',
    iptbrandslogan: '请填写品牌标语',
    brandshow: '是否前台展示',
    brandsort: '品牌排序',
    iptbrandsort: '请输入品牌排序',
    brandlogo: '品牌logo',
    brandpic: '品牌图片',
    brandstory: '品牌故事',
    brandid: '品牌编号',
    brandedit: '编辑品牌',
    delbrandtip: '此操作将永久删除该品牌, 是否继续?',
    uplogotip: '请上传logo图片',
    upbrandtip: '请上传品牌图片',
    iptbrandstory: '请填写品牌故事',
    iptsort: '请填写排序',
    upimgerror: '图片上传失败',
    upimgformat: '上传图片只能是 JPG / PNG 格式!',
    upimglimit: '上传图片大小不能超过 5MB!',
    // 前台类目
    channel: '渠道',
    showcategoryName: '展示类目名称',
    iptshowcategoryName: '请输入展示类目名称',
    showcategory: '展示类目',
    selectcategory: '请选择类目',
    editshowprop: '编辑前台展示属性',
    propname: '渠道名称',
    latcategory: '关联类目',
    selectlatcategory: '请选择关联类目',
    totop: '置顶',
    addshowcategory: '新增展示类目',
    deltip: '此删除操作将永久删除',
    // 运费模板
    usetemplate: '启用',
    unusetemplate: '禁用',
    // 商品管理
    category: '类目',
    goodsType: '商品类型',
    common: '普通',
    group: '组合套餐',
    updownstatus: '上下架状态',
    uptable: '已上架',
    downtable: '未上架',
    businessTypes: '业务类型',
    rent: '租赁',
    sale: '售卖',
    goodkeyWords: '商品关键字',
    iptkeyWords: '请输入商品名称、spuid',
    ipterpCode: '请输入erpCode',
    labelCategory: '类目标签',
    iptlabelCategory: '请输入类目标签',
    supplierMode: '业务模式',
    supply: '自营',
    deliver: '自营（支持代发货）',
    selling: '代租售',
    iptsupplier: '请输入供应商名称',
    goodid: '商品ID',
    good: '商品',
    commongood: '普通商品',
    groupgood: '套餐商品',
    specification: '规格',
    singlespec: '无多规格',
    specifications: '多规格',
    skuspec: 'sku规格',
    goodingroups: '套餐关联商品',
    stage: '租期',
    stageprice: '租金',
    stagenumber: '分期',
    stageNum: '期',
    onestageprice: '分期金额',
    onestagepricemin0: '分期金额必须大于0',
    salePrice: '一口价($)',
    onePayPrice: '一次性价格($)',
    renewalStagePrice: '续租租金',
    renewalOnePrice: '续租一口价',
    commission: '返佣比例',
    isRenewal: '是否可续租',
    canRenewal: '可续租',
    cantRenewal: '不可续租',
    upgood: '上架',
    downgood: '下架',
    // 商品详情
    gooddetail: '商品详情',
    baseInfo: '基本信息',
    goodname: '商品名称',
    goodNo: '商品编号',
    goodType: '商品类型',
    consume: '耗材',
    goodLabel: '商品标签',
    fromcategory: '所属类目',
    categorySort: '类目排序',
    goodbrand: '商品品牌',
    labelsort: '标签排序',
    authentication: '实名认证',
    istestgood: '是否测试商品',
    gooddesc: '商品描述',
    skupic: 'sku预览图',
    goodfunc: '商品参数',
    goodserv: '商品售后',
    isface: '是否人脸识别',
    isinstall: '是否安装',
    installprice: '安装费用',
    freightProvider: '自发货默认快递',
    yto: '圆通',
    sfexpress: '顺丰',
    platform: '平台配送',
    isdeliver: '供应商代发货',
    canuse: '支持',
    cantuse: '不支持',
    merchant: '代发货供应商',
    salemerchant: '代租售供应商',
    chargeRate: '代租售服务费率',
    cognatesku: '关联sku',
    skuinfo: 'sku信息',
    actualStock: '库存',
    erpCode: 'erp编码',
    officialPrice: '官网售价',
    basePrice: '基准价',
    depositPrice: '押金',
    supplierPrice: '供应商结算价',
    stagelist: '分期列表',
    stagedetail: '分期详情',
    rentdetail: '租期详情',
    stagenum: '分期数',
    onepayprice: '一次性支付价格',
    renewalstagePrice: '续租单价',
    renewalonePrice: '续租一次性价格',
    // 商品编辑
    categoryweight: '类目权重',
    iptcategoryweight: '请输入权重数值',
    iptgoodname: '请输入商品名称',
    iptgooddesc: '请描述商品优势',
    testgood: '测试商品',
    face: '人脸识别',
    need: '需要',
    noneed: '不需要',
    diy: '自定义',
    labelweight: '标签权重',
    iptlabelweight: '请输入标签下权重',
    goodpic: '商品图片',
    goodvideo: '商品视频',
    channelcode: '所属渠道',
    goodparame: '产品参数',
    servdesc: '售后说明',
    commontemp: '默认模板',
    editservtemp: '售后模板编辑',
    fronttstep: '上一步',
    nextstep: '下一步',
    addlabel: '新增标签',
    labelname: '标签名',
    iptlabelname: '请输入标签名称',
    flyaway: '租完免还',
    goodman: '信用免押',
    recommend: '推荐',
    newgood: '新品',
    try: '试用',
    iptgoodtype: '请选择商品类型',
    iptcategory: '请选择商品所属类目',
    iptwitincate: '请输入类目下权重',
    iptgooddescript: '请输入商品描述',
    iptistest: '选择是否是测试商品',
    iptwitinlab: '请输入标签下的权重',
    iptchannel: '请选择渠道',
    iptgoodpics: '请上传商品轮播图',
    iptdetailpics: '请上传商品详情图',
    iptparampic: '请上传参数图',
    iptservpics: '请上传售后图',
    iptgoodbrand: '请选择商品品牌',
    addmodelsucc: '创建模板成功',
    upmp4only: '只能上传MP4格式！',
    notsamelable: '不能添加相同的标签',
    iptrequire: '请完成必填项',
    skusetting: '产品规格设置',
    iptchargeRate: '请输入服务费率',
    ismulti: '是否多规格',
    addcognatesku: '添加关联sku',
    goodspec: '商品规格',
    addspec: '添加规格',
    addspecpic: '添加规格图片',
    clkslctspec: '点击选取规格值',
    specval: '规格值',
    addspecval: '添加规格值',
    specpictip:
      '仅支持为第一组规格设置规格图片，买家选择不同规格会看到对应规格图片，建议尺寸：800 x 800像素',
    addgoodspec: '添加产品规格',
    specdetail: '规格明细',
    groupval: '组合值',
    buyoutprice: '买断售价',
    buyouttip1: '1.商品开启买断开关后，用户可自主发起买断操作。',
    buyouttip2: '2.用户买断支付金额=买断售价-订单金额（包含续租和优惠券）',
    iptbuyoutprice: '请填写买断价',
    stagespec: '租期规格',
    stagerate: '分期费率',
    seestagerate: '查看分期费率',
    stagebilllist: '分期账单',
    firstpay: '首付',
    firstpayprice: '首付价格',
    slctstage: '租期选择',
    pricecoefficient: '租金系数',
    renewalpricecoef: '续租租金系数',
    seepricecoef: '查看租金系数',
    stageprices: '租金(租期|租金|续租租金|是否需要首付)',
    renewalfirstpay: '续租首付价格',
    setcommission: '佣金设置',
    samecategory: '同类目佣金',
    singlecommission: '单独设置佣金',
    nocommission: '不设置佣金',
    confirmadd: '确认添加',
    confirmedit: '确认修改',
    addstage: '添加租期',
    editstage: '修改租期',
    day: '天',
    month: '月',
    onepay: '一次性支付',
    renewalprice: '续租价格',
    stagefirstset: '分期首月设置',
    firstmonth: '首月',
    max100: '不能大于100',
    notallownum: '请填写有效数字',
    min0: '必须大于0',
    pricetohi: '价格太大了',
    min0max100: '费率在0至100之间',
    slctsupplier: '请选择供应商',
    iptsupplierMode: '请选择业务模式',
    ipttortoise: '请选择快递',
    iptjoinCommission: '请选择是否设置佣金',
    iptstage: '请输入租期',
    iptonepayprice: '请输入一次性支付价格',
    iptstagePrice: '请输入分期支付价格',
    iptofficialPrice: '请输入官网售价',
    iptdepositPrice: '请输入押金',
    iptbasePrice: '请输入基准价格',
    ipterpsku: '请输入ERP SKU编号',
    iptsupplierPrice: '请输入结算价',
    firstpaymin0: '首付价格必须大于0！',
    priceonlynum: '价格只能填写数字！',
    firstsmallersale: '首付价格不能大于售卖价格！',
    firstsmallertotal: '首付价格不能大于总价格！',
    renewalpricemin0: '续租价格必须大于0！',
    renewalfirstsmalltotal: '续租首付价格不能大于续租总价！',
    iptbasePricefirst: '请先填写基准价格！',
    iptsalePricefst: '请先填写一口价！',
    avatarRPG: '上传头像图片只能是 JPG 格式!',
    avatarmax2: '上传头像图片大小不能超过 2MB!',
    iptspecnamefst: '请先选择规格名称',
    youexist: '你输入的值已存在！',
    iptstagespec: '租期规格不能为空!',
    renewalfirstpaymin0: '续租首付价格必须大于0',
    iptcognatesku: '请选择关联sku!',
    loading: '请求中，请稍候',
    slctcognatesku: '选择关联sku',
    searchgoods: '商品搜索',
    iptkeywdsearchgood: '请输入关键词搜索商品',
    leftsku: '待选sku',
    rightsku: '已选sku',
    candragup: '支持拖拽上传',
    uploadFormatOnly: '上传格式只能是',
    uploadSizeMax: '上传大小不能超过',
    uploadImgPlz: '请上传图片'
  },
  // 订单管理
  order: {
    // 订单列表
    xxxxxxxx: 'xxxxxxxx',
    // 退货订单
    xxxxxxxx: 'xxxxxxxx',
    // 财务审核
    xxxxxxxx: 'xxxxxxxx'
  },
  // 经纪人管理
  agent: {},
  // 体验门店管理
  modelroom: {},
  // 房源管理
  house: {},
  // 风格套餐管理
  style: {},
  // 仓储管理
  warehouse: {
    // 仓库管理
    stockcode: '仓库编号',
    stockaddress: '仓库地址',
    stockname: '仓库名称',
    iptstockname: '请输入仓库名称',
    iptstockcode: '请输入仓库编号',
    inuse: '已启用',
    outuse: '未启用',
    manager: '管理员',
    iptcity: '请输入城市名称',
    iptprovince: '请选择省份',
    stockmanager: '仓库管理员',
    iptmanagername: '请输入管理员名字',
    iptremark: '填写备注',
    stockcodenumletter: '仓库编码只能是数字或字母',
    editstock: '编辑仓库',
    addstock: '新增仓库',
    max20: '不能超过20个字符',
    iptaddress: '请输入具体地址',
    iptstreet: '请输入街道信息',
    slctmanager: '请选择管理员',
    max50: '不能超过50个字符',
    stockdetail: '仓库详情',
    usestatus: '启用状态',
    // 库存管理
    goodsCategory: '商品类目',
    iptgoodkeyword: '请输入名称/编码/spuid/skuid',
    inventoryexplain: '库存名称解释',
    isinstocknum: '在库库存',
    isinstocknumexp: '在仓库内的库存数',
    cansaleinventory: '可售/可租库存',
    cansaleinventoryexp:
      '在库库存-锁定库存+允许超售部分，其中锁定的库存是下单和待发货锁定库存',
    pricelockinventory: '下单锁定库存',
    pricelockinventoryexp: '已下单未支付锁定库存，取消订单则释放',
    readysendlockinventory: '待发货锁定库存',
    readysendlockinventoryexp:
      '用户支付后，为待发货锁定库存，由下单锁定库存转移过来，及支付完成时，下单锁定库存-1，待发货锁定库存+1',
    sendinginventory: '发货在途',
    sendinginventoryexp: '发货出库，用户还未确认收货',
    leasinginventory: '租赁中库存',
    leasinginventoryexp: '用户租赁中的库存',
    tobereturned: '租赁待归还',
    returning: '租赁归还中',
    cancelinginventory: '退货中库存',
    cancelinginventoryexp: '已申请退货，且需归还货品的退货',
    buytoinstock: '采购待入库',
    buytoinstockexp: '已审批通过待入库的',
    allowoverline: '允许超售/租库存',
    allowoverlinexp: '用户前台下单时校验的库存数可售/租库存+允许超售/租库存',
    warninginventory: '库存告警值',
    warninginventoryexp: '当在库库存达到这个数值则告警',
    iptallowoverline: '请填写允许超售/租库存',
    iptwarninginventory: '请填写库存告警值',
    iptrightnum: '请填写正确的数字',
    editinventory: '编辑库存',
    // 资产管理
    skuid: 'SKU编号',
    iptskuid: '请输入SKU编号(数字)',
    iptsignfrom: '请选择注册来源',
    snid: 'SN编号',
    iptsnid: '请输入SN编号',
    slctstatus: '请选择状态',
    createmean: '新建档',
    instockmean: '在仓库',
    transitmean: '在途中',
    rentingmean: '租赁中',
    sellingmean: '售卖中',
    transferredmean: '已转让',
    massadd: '批量新增',
    meanbuyday: '资产采购日期',
    importtempdowm: '导入模板下载',
    importupload: '导入上传',
    addSNlot: '批量新增序列号',
    uploadSN: '上传序列号',
    uploadrighttype: '请上传正确的文件类型',
    erpcodenotept: '商品编号不能为空',
    snnotept: '资产序列号不能为空',
    snrule: '资产序列号只能为数字、字母、减号或者下划线',
    uperrmsg: '您上传的数据出现问题,问题数据已自动下载,请查看!',
    uploadfileplz: '请上传文件',
    snrepeat: '资产序列号重复',
    erpcodeError: 'erpCode不正确',
    buysupplier: '采购供应商',
    purchaseId: '采购单号',
    purchaseintime: '采购入库时间',
    purchaseprice: '采购价格',
    residualValue: '残值',
    meanchangedtl: '资产变动明细',
    stockchangeid: '出入库单号',
    relaorder: '关联订单',
    updatetime: '更新时间',
    orderbsnshistory: '订单交易记录',
    orderno: '订单号',
    tradeno: '交易号',
    ordertype: '订单类型',
    renewal: '续租',
    buyout: '买断',
    orderstatus: '订单状态',
    buytime: '下单时间',
    orderprice: '订单金额',
    shouldpay: '应付',
    realpay: '实付',
    // 入库管理
    waitforinstock: '待入库',
    isinstock: '已入库',
    isbroke: '已作废',
    manualaddinstock: '手动建单入库',
    bsnsfrom: '业务来源',
    buyinstock: '采购入库',
    expiredback: '到期回仓',
    rejectback: '退货回仓',
    changegoodinstock: '换货入库',
    checkinstock: '盘点入库',
    allotinstock: '调拨入库',
    otherinstock: '其它入库',
    businessNo: '业务单号',
    planinstocktime: '计划入库时间',
    instocktime: '入库时间',
    realinstocktime: '实际入库时间',
    broketime: '作废时间',
    instockid: '入库单号',
    supplier: '供应商',
    goodcode: '商品编码',
    goodnamespec: '商品名称&规格',
    shouldinmun: '应入库数量',
    alreadayinstocknum: '已入库数量',
    totalnum: '总数量',
    instockwarehouse: '入库仓库',
    iptinstockwarehouse: '请输入入库仓库名称',
    instockstatus: '入库状态',
    instockrecord: '入库操作人',
    brokerecord: '作废操作人',
    seeandinstock: '查看并入库',
    broke: '作废',
    confirmbrokeinstock: '确定要作废此入库单吗？',
    brokesuccess: '作废成功',
    instock: '入库',
    waitforinstocknum: '待入库数量',
    instocknum: '入库数量',
    iptinstocknum: '请填写要入库的数量',
    serialNumber: '资产序列号',
    addsn: '新增序列号',
    importsn: '导入序列号',
    exportsn: '导出序列号',
    confirminstock: '确认入库',
    instocknummax: '入库数量不能大于待入库数量',
    snquantitywrong: '资产序列号数量与入库数量不同!',
    remarkmax: '备注不能超过50个字符',
    addgood: '添加商品',
    iptquantity: '请输入数量',
    freightType: '物流方式',
    trackingNo: '物流单号',
    instockreason: '入库原因',
    iptinstockreason: '请填写入库原因',
    max30: '不能超过30个字符',
    addgoodplz: '请添加商品',
    instocksuccess: '入库成功',
    delgoodfromstock: '将此商品从入库单中删除？',
    goodinfo: '商品信息',
    toinstock: '入库处理',
    instocknumnot0: '不能选择待入库数量为0的入库单',
    // 出库管理
    waitingsend: '待发货'
  },
  // 财务管理
  financial: {
    // 采购结算
    businessNo: '采购单编号',
    iptbusinessNo: '请输入采购单编号',
    suppliername: '供应商名称',
    iptsuppliername: '请输入供应商名称',
    unsettlement: '未结算',
    settled: '已结算',
    purchase: '采购单',
    besettled: '应结算金额',
    settlemethod: '结算方式',
    settlebyT: '按 T+2 结算',
    settlebyMonth: '按每月5号结算',
    duedate: '应结算日期',
    settlestatus: '结算状态',
    iptsettlestatus: '请选择结算状态',
    confirmsettle: '结算确认',
    settlesprice: '结算金额',
    settletime: '结算时间',
    actualsettlesprice: '实际结算金额',
    iptactualsettlesprice: '请输入实际结算金额',
    actualsettlespricemin0: '实际结算金额不能小于 0',
    actualsettlesday: '实际结算日期',
    slctactualsettlesday: '请选择实际结算日期',
    canceltime: '取消时间',
    isslctordernum: '已选订单数',
    goodtotalnum: '商品总数',
    iptsettlesprice: '请输入结算金额',
    voucher: '凭证',
    clickupload: '点击上传',
    consolidatesettle: '合并结算',
    uploadsuccess: '上传成功',
    settlesuccess: '结算成功',
    // 手工建单结算
    xxxxxxxx: 'xxxxxxxx'
  },
  // 采购管理
  purchasesManage: {
    // 供应商管理
    supplierId: '供应商编号',
    iptsupplierId: '请输入供应商编号',
    suppliertype: '供应商类型',
    slctsuppliertype: '请选择供应商类型',
    cooperatstatus: '合作状态',
    iptcooperatstatus: '请选择合作状态',
    underway: '合作中',
    terminate: '已终止',
    settleperiod: '结算账期',
    contacts: '联系人',
    cancelcooperat: '取消合作',
    startcooperat: '开启合作',
    supplieraddr: '供应商地址',
    postaddr: '发货/收件地址',
    qualification: '相关资质',
    creatbank: '开户银行',
    iptcreatbank: '请输入开户银行',
    bankaccount: '银行账号',
    iptbankaccount: '请输入银行账户',
    confirmstartcoop: '确定要开启合作？',
    coopsuccess: '合作成功',
    confirmcancelcoop: '确定要取消合作？',
    cancelsuccess: '取消成功',
    purchasesubmittime: '采购单提交时间',
    slctperiod: '选择账期',
    delayNdays: '+N天结算',
    bymonth: '月结',
    byreceiptime: '用户确认收货时间',
    bybilltime: '用户账单时间',
    bypaytime: '用户实际支付时间',
    contactname: '联系人姓名',
    iptcontactname: '请填写联系人姓名',
    contactphone: '联系人电话',
    iptcontactphone: '请填写联系人电话',
    email: '邮箱',
    iptemail: '请输入邮箱',
    lacksuppliertype: '供应商类型填写不完整',
    // 采购订单
    purchasestatus: '采购单状态',
    iptpurchasestatus: '请选择采购单状态',
    saved: '待提交',
    partin: '部分入库',
    purchaseday: '采购日期',
    purchaseoneprice: '采购单价($)',
    iptpurchaseoneprice: '请输入采购单价',
    purchaseamount: '采购数量',
    iptpurchaseamount: '请输入采购数量',
    goodtotalprice: '总货款($)',
    shouldpayprice: '应付货款($)',
    logisticsFee: '物流费用',
    iptlogisticsFee: '请输入物流费用',
    purchaseTotalPrice: '应付总额($)',
    submittostock: '提交至待入库处理?',
    submitsucc: '提交成功',
    confirmdelpurch: '确定删除采购单吗?',
    confirmcancel: '确定取消?',
    newpuritem: '新增采购单',
    slctinstock: '请选择入库仓库',
    purchasegood: '采购商品',
    totalprice: '总金额',
    calculatetotalnum: '合计数量',
    calculatetotalprice: '合计总额',
    by: '按采购入库时间',
    purchasecontract: '采购合同',
    savenosubmit: '暂时保存不提交',
    today: '今天',
    yestoday: '昨天',
    longtimeago: '一周前',
    onlyonefile: '最多上传一个文件',
    confirmsettleperiod: '请确定您的结算账期',
    endpurchase: '手动完结',
    purchaseitemdetail: '采购单详情',
    purchasebaseinfo: '采购单基本信息',
    purchasecreater: '采购创建人',
    purchasegoodinfo: '采购商品信息',
    instocklog: '入库记录',
    settlements: '结算记录',
    remarkedit: '备注修改',
    delpurchasecfm: '确定删除采购单吗?',
    endpurchasecfm: '确定手动完结此采购单?',
    endsuccess: '完结成功',
    realinstocknum: '实际入库数量',
    realbesettled: '实际应结算金额',
    settleid: '结算单号'
  },
  // 资源位配置
  advertising: {},
  // 会员管理
  member: {},
  // 权限管理
  setCenter: {
    // 用户列表
    iptkeywdsearch: '请输入关键字搜索',
    searchactionevent: '查询操作事件',
    adduser: '添加用户',
    edituser: '编辑用户',
    accountname: '账号名称',
    name: '姓名',
    belongrole: '所属角色',
    phonenum: '手机号',
    addtime: '添加时间',
    logintime: '登录时间',
    confirmbanuser: '确认禁用此账号？',
    bansuccess: '禁用成功!',
    confirmpickuser: '确认启用此账号？',
    picksuccess: '启用成功!',
    confirmdeluser: '确认删除此账号？',
    edituserpwd: '修改用户密码',
    manageaccount: '管理账号',
    username: '用户名',
    password: '密码',
    confirmpwd: '确认密码',
    slctrole: '选择角色',
    slctroleplz: '请选择角色',
    accountrole: '请输入2-10位数字或字母下划线',
    iptphonenum: '请输入手机号',
    usernamerole: '2-10个文字或字母',
    pwdrole: '请输入6-10位数字或字母下划线',
    iptpwdagain: '请再次输入密码',
    resetuserpwd: '重置用户密码',
    illegalpwd: '密码格式不正确',
    diffpwd: '两次输入密码不一致',
    iptaccount: '请输入账号',
    illegalaccount: '账号格式不正确',
    illegalphonenum: '手机号码格式不正确！',
    iptrole: '请至少选择一个角色身份',
    iptname: '请输入姓名',
    illegalname: '姓名格式不正确',
    resetpwdsuccess: '密码重置成功',
    time: '时间',
    event: '事件',
    confirmclose: '确认关闭?',
    // 角色管理
    searchrole: '搜索角色',
    module: '模块',
    list: '列表',
    addrole: '添加角色',
    editrole: '编辑角色',
    confirmdelrole: '确定删除此角色?',
    rolename: '角色名',
    roledesc: '角色描述',
    iptrolename: '请输入角色名',
    lone3to5: '长度在 3 到 5 个字符',
    lone3to20: '长度在 3 到 20 个字符',
    iptroledesc: '请输入角色描述',
    modulestatus: '模块状态',
    isopen: '已开通',
    isclose: '已关闭',
    open: '开通',
    selectedmodules: '已选模块',
    opensuccess: '开通成功',
    closesuccess: '关闭成功',
    peoplename: '人员名称',
    // 菜单管理
    addmodule: '新增模块',
    delmodule: '删除模块',
    upmodule: '上线模块',
    downmodule: '下线模块',
    isonmodule: '已上线',
    isdownmodule: '已下线',
    funcmodules: '功能模块',
    confirmdelmodule: '确认删除此模块?',
    confirmopenmodule: '确定开通此模块?',
    confirmclosemodule: '确定关闭此模块?',
    modulepath: '模块路径',
    iptmodulepath: '请选择相对应路径',
    modulename: '模块名称',
    iptmodulename: '请输入模块名称'
  },
  common: {
    taozugong: '小公公',
    new: '新增',
    add: '添加',
    edit: '编辑',
    delete: '删除',
    detail: '详情',
    addSuccess: '添加成功',
    editSuccess: '修改成功',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    find: '查询',
    see: '查看',
    search: '搜索',
    all: '全部',
    remark: '备注',
    actions: '操作',
    actionsLog: '操作记录',
    creatTime: '创建时间',
    status: '状态',
    tips: '提示',
    confirm: '确认',
    save: '保存',
    cancel: '取消',
    submit: '提交',
    finish: '完成',
    close: '关闭',
    back: '返回',
    import: '导入',
    export: '导出',
    yes: '是',
    no: '否'
  }
};
