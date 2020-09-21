import $http from '@/utils/http'

export default {
  // 返佣订单统计
  allOrdersList(data) {
    return $http.post(`/partner/order/query`, data)
  },
  // 详情
  getDetail(no) {
    return $http.get(`/partner/order/info/${no}`, {})
  },
  // 企业返佣订单统计
  enterpriseOrdersList(data) {
    return $http.post(`/orders/company_count`, data)
  },
  // 合伙人返佣订单统计
  partnerOdersList(data) {
    return $http.post(`/orders/partner_count`, data)
  }
}
