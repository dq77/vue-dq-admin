import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import goodsInfo from './modules/goodsInfo';
import order from './modules/order';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import orderGoods from './modules/orderGoods';
import user from './modules/user';
import getters from './getters';
import purchase from './modules/purchase';
// import createPersistedState from 'vuex-persistedstate'
// import * as Cookies from 'js-cookie'

Vue.use(Vuex);

const store = new Vuex.Store({
  // plugins: [createPersistedState(
  //   {
  //     storage: {
  //       getItem: key => Cookies.get(key),
  //       // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
  //       setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
  //       removeItem: key => Cookies.remove(key)
  //     }
  //   }
  // )],
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    orderGoods,
    user,
    goodsInfo,
    order,
    purchase
  },
  getters
});

export default store;
