import $http from '@/utils/http'

export default {
  // 列表
  getList(data) {
    return $http.get(`/admin/admin/get_authentication_list`, data)
  },
  // 查看详情
  userDetail(id) {
    return $http.get(`/admin/admin/get_authentication_by_id/${id}`, {})
  },
  // 审核通过
  passApproval(id, data) {
    return $http.put(`/admin/admin/audit_authentication/success/${id}`, data);
  },
  // 审核拒绝
  refuseApproval(id, data) {
    return $http.put(`/admin/admin/audit_authentication/fail/${id}`, data);
  }
}
