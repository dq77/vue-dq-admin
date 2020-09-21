import $http from '@/utils/http.js'
export default {

  // 海报列表
  posterList(data) {
    return $http.post(`/goods/discount/manage/list`, data);
  },
  // 新增海报
  addPoster(data) {
    return $http.post(`/goods/discount/manage/add`, data)
  },
  // 删除海报
  deletePoster(id) {
    return $http.put(`/goods/discount/manage/del/${id}`, {})
  },
  // 启用
  onShelf(id) {
    return $http.put(`/goods/discount/manage/on_shelf/${id}`, {})
  },
  // 下架
  offShelf(id) {
    return $http.put(`/goods/discount/off_shelf/${id}`, {})
  },
  // 修改海报
  update(data) {
    return $http.post(`/goods/discount/manage/update`, data);
  }

}
