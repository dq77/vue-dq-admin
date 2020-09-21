import $http from '@/utils/http';

// 类目下拉框
export function selectCategory() {
  return $http.get('/goods/category_drop', {});
}

// 获取资产管理列表
export function getWarehouseList(data) {
  return $http.post('/warehouse/management/list', data)
}

// 获取资产详情
export function getWarehouseDetail(data) {
  return $http.get('/warehouse/management/detail', data)
}

// 获取资产变动明细
export function getWarehouseAssetChangeList(data) {
  return $http.get('/warehouse/asset_change_list', data)
}

// 添加资产(采购入库)
export function fetchwarehouseAdd(data) {
  return $http.post('/warehouse/management/add', data)
}

// 添加一条资产信息
export function fetchwarehouseAddlibrary(data) {
  return $http.post('/warehouse/management/add_one_asset_to_library', data)
}

// 删除资产
export function fetchwarehouseDelete(data) {
  return $http.delete(`/warehouse/management/delete/${data}`, data)
}

// 查看详情, 资产详情
export function fetchmanagementDetail(data) {
  return $http.get('/warehouse/management/detail', data)
}

// 修改资产
export function fetchWarehouseAmodify_assets(data) {
  return $http.post('/warehouse/management/modify_assets', data)
}

// 确认资产入库的提示
export function fetchmanagementLibrary(data) {
  return $http.post('/warehouse/management/pre_asset_to_library', data)
}

// 订单交易记录
export function fetchmanagementrecordslist(data) {
  return $http.get('/warehouse/management/records_list', data)
}

// 新资产管理
// 新获取资产管理列表
export function getassestList(data) {
  return $http.get(`/assets/pageable/${data.page}-${data.pageSize}`, data)
}
// 新获取资产详情
export function getassestDetail(data) {
  return $http.get(`/assets/${data.skuId}/${data.sn}`, data)
}
// 新批量上传
export function uploadasset(data) {
  return $http.post('/assets', data)
}

// 批量上传确定
export function uploadassetpurchase(data) {
  return $http.post('/warehouse/management/upload_asset', data)
}

/* 库存管理 */

// 获取库存管理列表
export function fetchstocklist(data) {
  return $http.post('/goods/stock/list', data)
}

// 库存调整
export function stockupdate(data) {
  return $http.get('/goods/stock/change_sku_stock', data)
}

// 库存调整历史
export function stockChangelog(data) {
  return $http.get('/goods/stock/sku_change_log', data)
}

// sku列表
export function skuList(data) {
  return $http.get(`/goods/stock/sku_list/${data.spuNo}`)
}

// 新 库存管理
// 获取库存管理列表
export function getstocklist(data) {
  return $http.get(`/v1/inventories/pageable/${data.page}-${data.pageSize}`, data)
}

// 获取商品对应库存量
export function getinventories(data) {
  return $http.get(`/v1/inventories`, data)
}

// 更新库存预警值
export function updateInventories(data) {
  return $http.put2(`/v1/inventories`, data)
}

/* 订单管理--资产序列号绑定 */

// 资产列表
export function fetchadminordersnlist(data) {
  return $http.post('/orders/admin_order_sn_list', data)
}

// 添加资产编号
export function addSn(data) {
  return $http.post('/orders/add_sn', data)
}

/*
  订单管理--资产序列号绑定
*/

// 上传资产序列号文件
export function batchAddSn(data) {
  return $http.post('/orders/batch_add_sn', data)
}

// 导出失败列表
export function exportSnResult(data) {
  return $http.post('/orders/export_sn_result', data)
}
