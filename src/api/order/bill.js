import $http from '@/utils/http.js'

export default {
  // 父订单账单详情
  orderBill(no) {
    return $http.get(`/order/${no}/bill`, {})
  },
  // 子订单账单详情
  childBill(no) {
    return $http.get(`/record/${no}/bill`, {});
  },
  // 父订单-账单支付记录
  orderPayLog(id) {
    return $http.get(`/order/bill/${id}/history`, {})
  },
  // 父订单发起支付
  payAgin(id) {
    return $http.post(`/order/bill/${id}`, {})
  },
  // 子订单支付记录
  childPayLog(id) {
    return $http.get(`/record/bill/${id}/history`, {})
  },
  // 退款接口、审核通过
  payReturn(data) {
    return $http.post(`/order/record/return`, data);
  },
  // 修改父账单的账单状态
  billStatus(id, data) {
    return $http.put(`/order/bill/${id}`, data);
  },
  // 查看退货账单中的退收款日志
  payInfo(data) {
    return $http.get(`/order/record/refund`, data)
  }
}
