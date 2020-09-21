import $http from '@/utils/http.js'
export default {
  // 新增欢迎页
  addAPP(data) {
    return $http.post(`/goods/app_welcome_page/management/add`, data);
  },
  // 编辑欢迎页
  updateAPP(data) {
    return $http.post(`/goods/app_welcome_page/management/update`, data);
  },
  // 删除欢迎页
  deleteAPP(id) {
    return $http.get(`/goods/app_welcome_page/management/del/${id}`, {})
  },
  // 列表展示
  APPList(data) {
    return $http.get(`/goods/app_welcome_page/management/page_info`, data);
  },
  // 上架
  onShelf(id) {
    return $http.get(`/goods/app_welcome_page/management/client_show/${id}`, {});
  },
  // 下架
  offShelf(id) {
    return $http.get(`/goods/app_welcome_page/management/client_hide/${id}`, {});
  }
}
