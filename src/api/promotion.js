import $http from '@/utils/http.js'
export default {
  // 获取订单返现的列表
  getPromotionList(data = {}) {
    return $http.post(`/promotions/query`, data);
  },
  // 新增订单返现
  createPromotionList(data) {
    return $http.post(`/promotions/create`, data)
  },
  // 编辑保存订单返现
  updatePromotionList(data) {
    return $http.post(`/promotions/update`, data)
  },
  // 获取编辑日志
  getPromotionLog(data) {
    return $http.get(`/promotions/log/id`, data)
  },
  // 开启活动
  releasePromotion(data) {
    return $http.get(`/promotions/release/id`, data)
  },
  // 关闭活动
  cancelPromotion(data) {
    return $http.get(`/promotions/cancel/id`, data)
  },
  // 优惠券操作日志
  couponeLog(data) {
    return $http.get(`/coupon/operate_log`, data)
  },
  // 修改优惠券
  updateCoupone(data) {
    return $http.post(`/coupon/update`, data)
  }
}
