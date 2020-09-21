const goodsInfo = {
  state: {
    goodsInfo: {},
    category: [],
    skus: [],
    skuDetail: [],
    detailForm: {},
    origin: '',
    attribute: [],
    businessType: ''
  },
  mutations: {
    SET_INFO: (state, info) => {
      state.goodsInfo = info;
    },
    // 类目存储
    SET_CATEGORY: (state, info) => {
      state.category = info;
    },
    // 属性存储
    SET_ATTRIBUTE: (state, info) => {
      state.attribute = info;
    },
    SET_SKU: (state, info) => {
      state.skus = info;
    },
    SET_SKU_DETAIL: (state, info) => {
      state.skuDetail = info;
    },
    SET_DETAILFORM: (state, info) => {
      state.detailForm = info;
    },
    // 判断是不是新增还是编辑
    SET_ORIGIN: (state, info) => {
      state.origin = info;
    },
    // 将商品类型存储
    SET_BUSINESSTYPE: (state, type) => {
      state.businessType = type;
    }
  }
}
export default goodsInfo
