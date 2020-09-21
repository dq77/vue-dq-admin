import $http from '@/utils/http.js'

export default {
  // 订单交易记录列表
  orderDealList(data) {
    return $http.post(`/orders/list`, data);
  },
  // 订单列表接口
  orderList(data) {
    return $http.post(`/orders/list`, data);
  },
  // 订单详情页
  orderDetail(data) {
    return $http.get(`/orders/info`, data)
  },
  // 订单操作日志
  opreatLog(data) {
    return $http.get(`/orders/order_operate_log`, data)
  },
  // 添加备注
  addRemark(data) {
    return $http.put(`/orders/seller_remark`, data)
  },
  // 根据用户id获取收货地址
  getAddress(id) {
    return $http.get(`/background/admin/get_by_address_id/${id}`, {})
  },
  // 修改收货地址
  updateAddress(data) {
    return $http.post(`/orders/update_receive_address`, data)
  },
  // 物流详情
  expressDetail(data) {
    return $http.get(`/orders/query_by_order_no`, data)
  },
  // 订单列表页统计状态个数
  getCount() {
    return $http.get(`/orders/count`, {})
  },
  // 获取物流公司下拉框
  expressCompany() {
    return $http.get(`/orders/exp_company_list`, {})
  },
  // 修改创建物流单号
  updateExpress(data) {
    return $http.post(`/orders/update_logistics`, data);
  },
  // 后台创建物流
  createExpress(data) {
    return $http.post(`/orders/create_logistics`, data);
  },
  // 确认收货
  receviedGood(data) {
    return $http.put(`/orders/confirm_by_admin`, data)
  },
  // 取消订单
  cancelOrder(data) {
    return $http.delete(`/orders/close`, data)
  },
  // 账单查询
  billView(data) {
    return $http.post(`/bill/list`, data)
  },
  // 买断价格
  buyOutPrice(data) {
    return $http.put(`/orders/buyout_price`, data)
  },
  // 退货申请
  returnApplication(data) {
    return $http.post(`/refund/return_goods/create`, data)
  },
  // 撤销退货申请
  returnedClose(data) {
    return $http.put(`/refund/return_goods/close`, data)
  },
  // 查看退货进度详情
  viewReturned(data) {
    return $http.get(`/refund/return_goods/query_by_refund_no`, data)
  },
  // 买断记录
  buyOutLog(data) {
    return $http.get(`/orders/buyout_info`, data)
  },
  // 续租记录
  renewalLog(data) {
    return $http.get(`/orders/renewal_info`, data)
  },
  // 查看续租/买断的订单号进入详情
  buyOfRenewal(data) {
    return $http.get(`/orders/history_info`, data)
  },
  // 货物退还跟踪确认接口
  backConfirm(data) {
    return $http.post(`/orders/back_confirm`, data);
  },
  getRiskCount() {
    return $http.get(`/orders/count_risk_orders`, {});
  },

  // 通过订单号获取签约信息
  getAuthInfo(no) {
    return $http.get(`/auth_info/freeze/${no}`, {})
  },

  // 代发代租售订单 发货处理
  deliverOrder(data) {
    return $http.put2(`/v1/orders/deliver`, data)
  },
  // 手动建单
  creatOrder(data) {
    return $http.post(`/orders`, data)
  },

  // 查询剩余押金/未解冻押金
  getUnfreeze(no) {
    return $http.get(`/auth_info/get/pre_unfreeze/info/${no}`, {})
  },

  // 手动解约
  terminationContract(data) {
    return $http.post(`/auth_info/manual_unfreeze`, data)
  },

  // 获取历史解约信息
  getContractHistory(no) {
    return $http.get(`/auth_info/unfreeze/${no}`, {})
  },

  // 分期代扣统计
  WithholdingAmt() {
    return $http.get(`/orders/bill_status_count`, {})
  }
}
