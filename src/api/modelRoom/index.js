import $http from '@/utils/http.js';

export default {
  // 分页查询信息
  getRoomList(data) {
    return $http.post(`/v1/management/shops/page`, data);
  },
  // 查询单个
  getRoomDetail(data) {
    return $http.get(`/v1/management/shops/shop/${data.id}`, data);
  },
  // 添加
  addshop(data) {
    return $http.post(`/v1/management/shops/shop`, data);
  },
  // 修改
  updateShop(data) {
    return $http.put2(`/v1/management/shops/shop/${data.id}`, data);
  },

  // 修改门店状态
  editRemarkStateus(data) {
    return $http.put2(
      `/v1/management/shops/shop/status/${data.id}?status=${data.status}`,
      data
    );
  },

  // 删除门店
  deleteShop(data) {
    return $http.delete(`/v1/management/shops/shop/${data.id}`, data);
  }
  // // 订单操作日志
  // opreatLog(data) {
  //   return $http.get(`/orders/order_operate_log`, data);
  // },
};
