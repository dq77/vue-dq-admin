import $http from '../../utils/http';

export default {
  // 获取弹框列表
  getPopupList(data) {
    return $http.post(`/goods/pop/manage_list`, data)
  },
  // 修改弹窗
  updatePopup(data) {
    return $http.post(`/goods/pop/edit`, data)
  },
  // 弹框删除
  deletePopup(id) {
    return $http.post(`/goods/pop/del/${id}`, {})
  },
  // 添加弹框
  addPopup(data) {
    return $http.post(`/goods/pop/add`, data);
  },
  // 弹框图片上架
  uploadPopup(id) {
    return $http.post(`/goods/pop/on_shelf/${id}`, {})
  },
  // 上架
  onShelf(id) {
    return $http.post(`/goods/pop/on_shelf/${id}`, {})
  },
  // 下架
  offShelf(id) {
    return $http.post(`/goods/pop/off_shelf/${id}`, {})
  }
}
