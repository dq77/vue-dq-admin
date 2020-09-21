import $http from '@/utils/http.js'

export default {
  // 退货单列表
  refundList(data) {
    return $http.post(`/refund/return_goods/query`, data)
  },
  // 根据退货单查询退货详情
  refundDetail(data) {
    return $http.get(`/refund/return_goods/query_by_refund_no`, data)
  },
  // 提交财务审核
  financialApproval(data) {
    return $http.put(`/refund/return_goods/submit`, data)
  },
  // 添加备注
  addRemark(data) {
    return $http.put(`/refund/return_goods/remark`, data);
  },
  // 确认回仓
  confirmBack(data) {
    return $http.post(`/refund/return_goods/confirm`, data);
  },
  // 线下退收款确认
  confirmOffLine(data) {
    return $http.put(`/refund/return_goods/offline_poundage_confirm`, data)
  },
  // 客服确认退收款金额
  returnMoney(data) {
    return $http.put(`/refund/return_goods/update_poundage`, data);
  },
  // 退单导出功能
  returnExport(data) {
    return $http.post(`/refund/return_goods/export`, data, 'arraybuffer');
  },
  // 财务驳回
  approvalRefuse(data) {
    return $http.put(`/refund/return_goods/finance_refuse`, data)
  },
  // 财务退收款确认
  confirmMoney(data) {
    return $http.put(`/refund/return_goods/poundage_confirm`, data);
  },
  // 统计退货单的数量
  totalCount() {
    return $http.get(`/refund/return_goods/count`, {});
  },
  // 退货回仓数据统计
  refundGoodsTotal() {
    return $http.get(`/refund/return_goods/count_goods`, {})
  }
}
