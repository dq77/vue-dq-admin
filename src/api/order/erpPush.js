import $http from '@/utils/http.js'

export default {

  // erp订单列表
  erpList(data) {
    return $http.post(`/erp/failList`, data);
  },
  // erp推送
  erpPush(data) {
    return $http.post(`/erp/manual_push`, data);
  }
}
