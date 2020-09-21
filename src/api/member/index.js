import $http from '../../utils/http'

// 查看详情-用户信息
export function viewdetail(data) {
  return $http.get(`/admin/management/detail/${data.id}`, {})
}

// 后台用户列表
export function managementList(data) {
  return $http.get('/admin/management/list', data)
}

// 地址--授权
export function getAuthAddress(data) {
  return $http.get(`/background/admin/get_by_id/${data.id}`, {})
}

// 订单记录
export function ordersRecord(data) {
  return $http.get('/orders/admin_query_by_uid', data)
}

// 标签编辑
export function updateTags(data) {
  return $http.post(`/users/update_tag/${data.id}`, data)
}

// 测试用户编辑
export function updateTestUser(data) {
  return $http.put(`/background/admin/set_test_user/${data.id}`, data)
}
