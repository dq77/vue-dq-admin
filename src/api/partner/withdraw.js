import $http from '@/utils/http'

export default {

  // 获取提现列表
  getWithdrawList(data) {
    return $http.post(`/bill/partner/admin/list_cash_withdrawal`, data)
  },
  // 提现通过
  passWithdraw(data) {
    return $http.post(`/bill/partner/admin/cash_withdrawal/pass`, data);
  },
  // 审核拒绝
  refuseWithdraw(data) {
    return $http.post(`/bill/partner/admin/cash_withdrawal/refuse`, data);
  },
  getBalanceList() {
    return $http.get(`/select_balance_list`, {})
  }
}
