import $http from '@/utils/http.js'

export default {
  // 分页查询仓库信息
  getStockList(data) {
    return $http.get(`/v1/warehouses/pageable/${data.page}-${data.pageSize}`, data);
  },
  // 添加一个仓库
  addWarehouse(data) {
    return $http.post(`/v1/warehouses`, data);
  },
  // 修改仓库
  updateWarehouse(data) {
    return $http.put2(`/v1/warehouses`, data)
  },
  // 订单操作日志
  opreatLog(data) {
    return $http.get(`/orders/order_operate_log`, data)
  },
  // 添加备注
  addRemark(data) {
    return $http.put(`/orders/seller_remark`, data)
  }
}
