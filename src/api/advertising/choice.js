import $http from '@/utils/http.js'
export default {
  // 获取精选列表
  getList(data) {
    return $http.post(`/goods/recommendation/manage_list`, data)
  },
  // 添加
  addChoice(data) {
    return $http.post(`/goods/recommendation/add`, data);
  },
  // 修改
  updateChoice(data) {
    return $http.post(`/goods/recommendation/update`, data)
  },
  // 删除
  deleteChoice(id) {
    return $http.post(`/goods/recommendation/del/${id}`, {})
  },
  // 上线
  onShelf(id) {
    return $http.post(`/goods/recommendation/on_line/${id}`, {})
  },
  // 下线
  offShelf(id) {
    return $http.post(`/goods/recommendation/off_line/${id}`, {});
  },
  // 置顶
  toTop(id) {
    return $http.post(`/goods/recommendation/top/${id}`, {});
  },
  // 修改历史
  historyList(data) {
    return $http.get(`/goods/recommendation/log/history`, data)
  }
}
