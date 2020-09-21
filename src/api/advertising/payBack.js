import $http from '@/utils/http.js'
export default {

  // 获取列表详情
  getPayBackList(data) {
    return $http.post(`/pay_back/list`, data)
  },
  // 获取操作日志
  payLog(id) {
    return $http.post(`/pay_back/${id}/log`, {})
  },
  // 创建返现券
  addPayBack(data) {
    return $http.post(`/pay_back/create`, data)
  },
  // 修改返现券
  updatePayBack(data) {
    return $http.post(`/pay_back/update`, data)
  },
  // 返现详情
  payBackDetail(id) {
    return $http.get(`/pay_back/${id}/info`, {})
  },
  // 修改返现状态
  changeStatus(operation, id) {
    return $http.post(`/pay_back/${operation}/${id}`, {})
  }
}
