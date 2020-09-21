const order = {
  state: {
    orderObj: {},
    orderRole: ''
  },
  mutations: {
    SET_ORDER: (state, info) => {
      state.orderObj = info;
    }
  }
}
export default order
