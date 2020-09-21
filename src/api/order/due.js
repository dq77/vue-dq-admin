import $http from '@/utils/http.js'

export default {

  // 到期归还置为坏账
  setDebts(data) {
    return $http.get(`/orders/set_order_bad`, data)
  },

  // 归还订单统计
  dueCount() {
    return $http.get(`/orders/return_status_count`, {})
  },

  // 重置为非坏帐
  resetDeadOrder(data) {
    return $http.get(`/orders/set_bill_normal`, data)
  },

  // 账单逾期归还
  setBillDebts(data) {
    return $http.get(`/orders/set_bill_bad`, data)
  }
}
