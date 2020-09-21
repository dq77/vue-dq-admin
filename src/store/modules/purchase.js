const purchase = {
  state: {
    checkedPurchaseGood: [], // 用户在采购单添加选择的数组
    deleteList: [] // 新增采购单用户做了删除后的剩余数组
  },
  mutations: {
    SET_PURCHASEGOODLIST: (state, selecetedGood) => {
      state.checkedPurchaseGood = selecetedGood;
    },
    SET_DELETELIST: (state, deleteList) => {
      state.deleteList = deleteList;
    }
  },
  actions: {
    SelecetedGood({ commit, state }, data) {
      return new Promise(resolve => {
        commit('SET_PURCHASEGOODLIST', data);
        resolve();
      });
    },
    DelatedList({ commit, state }, data) {
      return new Promise(resolve => {
        commit('SET_DELETELIST', data);
        resolve();
      });
    }
  }
};
export default purchase;
