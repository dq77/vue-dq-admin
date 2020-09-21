import $http from '@/utils/http'

/* 管理员 */

// 添加管理员
export function addUser(data) {
  return $http.post('/admin/background/add_user', data)
}

// 启用管理员
export function ableUser(data) {
  return $http.put(`/admin/background/admin/able/${data.id}`, {})
}

// 删除管理员
export function deleteUser(data) {
  return $http.delete(`/admin/background/admin/delete/${data.id}`, {})
}

// 禁用管理员
export function disableUser(data) {
  return $http.put(`/admin/background/admin/disable/${data.id}`, {})
}

// 管理员操作事件
export function usermodifylist(data) {
  return $http.get('/admin/background/admin/get_modify_list', data)
}

// 管理员列表
export function adminlist(data) {
  return $http.get('/admin/background/adminlist', data)
}

// 编辑用户
export function modifyUser(data) {
  return $http.post('/admin/background/modify_user', data)
}

// 查看管理员资料
export function viewAdmindetail(data) {
  return $http.get(`/admin/background/admin_detail/${data.id}`, {})
}

// 管理员密码重置
export function resetPass(data) {
  return $http.get(`/admin/background/reset_pass/${data.id}`, {})
}

// 当前账户修改密码
export function updatePass(data) {
  return $http.post(`/admin/background/update_pass`, data)
}

/* 角色 权限 */

// 权限删除
export function authorityDelete(data) {
  return $http.post(`/background/authority/${data.id}`, {})
}

// 权限新增
export function authorityAdd(data) {
  return $http.post('/background/authority/add', data)
}

// 权限列表
export function authorityList(data) {
  return $http.get('/background/authority/list', data)
}

// 权限关闭
export function authorityable(data) {
  return $http.put(`/background/authority/close/${data.id}`, {})
}

// 权限启用
export function authoritydisable(data) {
  return $http.put(`/background/authority/start/${data.id}`, {})
}

// 角色删除
export function deleteRoles(data) {
  return $http.delete(`/background/role/${data.id}`, {})
}

// 新增角色
export function addRoles(data) {
  return $http.post('/background/role/add', data)
}

// 角色下的权限列表
export function getauthoritybyrole(data) {
  return $http.get('/background/role/get_authority_by_role', data)
}

// 角色列表
export function getRoleList(data) {
  return $http.get('/background/role/list', data)
}

// 查询角色详情
export function getroledetail(data) {
  return $http.get(`/background/role/get_role_by_id/${data.roleId}`, {})
}

// 编辑角色
export function modifyRoles(data) {
  return $http.post('/background/role/modify', data)
}

// 给角色开通权限
export function openAuthorityRole(data) {
  return $http.put('/background/role/open_authority_to_role', data)
}

// 给角色开通权限
export function closeAuthorityRole(data) {
  return $http.put('/background/role/close_authority_to_role', data)
}

// 获取角色下的用户
export function getadminbyrole(data) {
  return $http.get('/background/role/get_admin_by_role', data)
}

// 删除角色下的某个用户
export function deladminbyrole(data) {
  return $http.delete('/background/role/del_admin_by_role', data)
}
