import $http from '@/utils/http';

// 查询房源列表
export const rqListingsList = data =>
  $http.post(`/v1/management/houses/page`, data);

// 新增房源
export const rqAddListings = data =>
  $http.post(`/v1/management/houses/house`, data);

// 查询单个房屋信息
export const rqHourseInfo = data =>
  $http.get(`/v1/management/houses/house/${data.id}`, data);

// 修改房屋信息
export const rqUpdatehourse = data =>
  $http.put2(`/v1/management/houses/house/${data.id}`, data);

// 修改房屋状态
export const rqUpdatehourseStateus = data =>
  $http.put(
    `/v1/management/houses/house/status/${data.id}?status=${data.status}`,
    data
  );

// 删除房屋信息
export const rqDeletehourse = data =>
  $http.delete(`/v1/management/houses/house/${data.id}`);
