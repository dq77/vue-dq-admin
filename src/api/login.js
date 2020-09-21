import $http from '@/utils/http'

// export function loginByUsername(username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }

// export function logout() {
//   return request({
//     url: '/login/logout',
//     method: 'post'
//   })
// }

// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// 登陆
// export function loginByUsername(data) {
//   return $http.post(`/admin/background/login`, data)
// }
export function loginByUsername(data) {
  return $http.post(`/admin/background/login`, data)
}

// 获取用户信息
// export function getUserInfo(id) {
//   return $http.get(`/admin/management/detail/${id}`, {})
// }
export function getUserInfo(data) {
  return $http.get(`/admin/background/get_admin_info`, data)
}

// // 登出
// export function logout(data) {
//   return $http.post(`/login/logout`, data)
// }
