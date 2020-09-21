import $http from '../../utils/http';
// // 获取渠道列表
// export function getChnnelList() {
//   return $http.get(`productChannel/listProductChannel`, {})
// }

// // 获取banner列表
// export function getBannerList(obj) {
//   return $http.get(`banner/listBannerBySearch`, obj)
// }

// // 获取banner详情
// export function getBannerDetail(bannerId) {
//   return $http.get(`banner/getBannerInfoByBannerId`, {})
// }
// // 添加banner
// export function addBanner(obj) {
//   return $http.post(`banner/insertBannerDO`, obj)
// }
// // 修改banner内容
// export function updateBanner(obj) {
//   return $http.post(`banner/updateBannerDO`, obj)
// }
// // 修改banner上下架状态
// export function upStatus(obj) {
//   return $http.post(`banner/onShelf`, obj)
// }

// // banner置顶
// export function bannerTop(obj) {
//   return $http.post(`banner/bannerTop`, obj)
// }
// // 图片上传
// export function upload(MultipartFile) {
//   return $http.post(`img/imgUpload`, MultipartFile)
// }
// // 查询商品列表
// export function searchBanner(obj) {
//   return $http.get(`product/listProductBySearchKey`, obj)
// }
// // 获取弹窗列表
// export function getPopupList(data) {
//   return $http.get(`/popUpAds/list`, {})
// }

// // 新增弹窗
// export function addPopups(data) {
//   return $http.post(`/popUpAds/add`, data)
// }

// // 查看弹窗详情
// export function viewPopups(id) {
//   return $http.get(`/popUpAds/find/${id}`, {})
// }
// // 修改popups
// export function editPopups(data) {
//   return $http.post(`/popUpAds/update`, data)
// }

export default{
  // banner列表
  getBannerList(data) {
    return $http.post(`/goods/banner/page_list`, data)
  },
  // 新增banner
  addBanner(data) {
    return $http.post(`/goods/banner/add`, data);
  },
  // 删除banner
  deleteBanner(id) {
    return $http.post(`/goods/banner/del/${id}`, {})
  },
  // banner下架
  offShelf(id) {
    return $http.post(`/goods/banner/off_shelf/${id}`, {})
  },
  // banner上架
  onShelf(id) {
    return $http.post(`/goods/banner/on_shelf/${id}`, {})
  },
  // banner置顶
  toTop(id) {
    return $http.post(`/goods/banner/top/${id}`, {})
  },
  // 修改banner
  updateBanner(data) {
    return $http.post(`/goods/banner/update`, data);
  },
  // 上传banner图片
  uploadImg(data) {
    return $http.post(`/goods/banner/upload_img`, data);
  }

}
