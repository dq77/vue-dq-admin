import $http from '@/utils/http.js'

// 获取导航列表
export function getnavlist(data) {
  return $http.post('/goods/nav/manage/list', data);
}

// 添加导航
export function addnav(data) {
  return $http.post('/goods/nav/manage/add', data);
}

// 删除导航
export function delnav(data) {
  return $http.put(`/goods/nav/manage/del/${data.navigationId}`, {});
}

// 更新导航
export function updatenav(data) {
  return $http.post('/goods/nav/manage/update', data);
}

// 置顶导航
export function topnav(data) {
  return $http.put(`/goods/nav/manage/to_top/${data.navigationId}`, {});
}
// 上架导航
export function onshelfnav(data) {
  return $http.put(`/goods/nav/manage/on_shelf/${data.navigationId}`, {});
}
// 下架导航
export function offShelfgetnavlist(data) {
  return $http.put(`/goods/nav/manage/off_shelf/${data.navigationId}`, {});
}
// 导航图片添加
export function uploadNavimg(data) {
  return $http.post('/goods/nav/upload_img', data);
}

// 可选择的路由列表
export const getWebRouteList = (data) => $http.post('/goods/nav/manage/web_route_list', data);
