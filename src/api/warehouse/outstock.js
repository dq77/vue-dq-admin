import $http from '@/utils/http.js'

export default {
  // 分页查询出库单信息
  getOutstockList(data) {
    let str = (data.status == 'SUBMITTED,STOCK_OUT_PARTLY' || data.status == 'SAVED')? '/group':''
    return $http.get(`/v1/stock_out${str}/pageable/${data.page}-${data.pageSize}`, data);
  },
  // 查询出库单详情信息
  getOutstockDetail(data) {
    let str = data.status == 'SUBMITTED'? '/group':''
    return $http.get(`/v1/stock_out${str}/${data.stockOutId}`, data);
  },
  // 预约货运服务
  bookFreight(data) {
    return $http.put2(`/v1/stock_out/freight/book`, data);
  },
  // 修改发货方式
  changeFreight(data) {
    return $http.put2(`/v1/stock_out/freight`, data);
  },
  // 修改出库仓库
  changeStockOut(data) {
    return $http.put2(`/v1/stock_out/group`, data);
  },
  // 绑定货运单号
  changeTrackingNo(data) {
    return $http.put2(`/v1/stock_out/freight/trackingNo`, data);
  },
  // 驳回至发货确认环节
  rejectStockOut(data) {
    return $http.put2(`/v1/stock_out/group/reject`, data);
  },
  // 作废出库单
  breakOutstock(data) {
    return $http.put2(`/v1/stock_out/break`, data)
  },
  // 取消预约
  cancelFreight(data) {
    return $http.put2(`/v1/stock_out/freight/cancel`, data)
  },
  // 获取打印信息
  getPrintInfo(data) {
    return $http.put2(`/v1/stock_out/freight/print`, data)
  },
  // 提交操作
  confirmOut(data) {
    return $http.put2(`/v1/stock_out/group/confirm`, data)
  },
  // 出库操作
  deliverOut(data) {
    return $http.put2(`/v1/stock_out/group/deliver`, data)
  },
  // 手动新增出库单
  creatOutstock(data) {
    return $http.post(`/v1/stock_out`, data)
  },
  // 获取物流公司
  getFreights() {
    return $http.get(`/v1/stock_out/freight/serviceProviders`);
  }
  
}
