const orderGoods = {
  state: {
    selectedOrderGoods: [], // 用户在手动建单添加选择的商品数组(含租期)
  },
  mutations: {
    SET_SELECTEDORDERGOODS: (state, selecetedGoods) => {
      state.selectedOrderGoods = selecetedGoods;
    },
  },
  actions: {
    addOrderGoods({ commit, state }, data) {
      return new Promise(resolve => {
        commit('SET_SELECTEDORDERGOODS', data);
        resolve();
      });
    },
  }
};
export default orderGoods;
