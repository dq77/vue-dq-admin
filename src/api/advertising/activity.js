import $http from '@/utils/http.js'
export default {
  // 列表页
  activityList(data) {
    return $http.post(`/goods/active/list`, data);
  },
  // 新增活动页
  addActivity(data) {
    return $http.post(`/goods/active/add`, data);
  },
  // 修改活动页
  updateActivity(data) {
    return $http.post(`/goods/active/edit`, data);
  },
  // 下架
  offShelf(id) {
    return $http.put(`/goods/active/off_shelf/${id}`, {})
  },
  // 上架
  onShelf(id) {
    return $http.put(`/goods/active/on_shelf/${id}`, {})
  },
  // 删除活动页
  deleteActivity(id) {
    return $http.put(`/goods/active/del/${id}`, {})
  }
}
