import $http from '@/utils/http';

// 创建风格套餐
export const rqraddStyleHourse = data =>
  $http.post(`/v1/management/stylePackages/stylePackage`, data);

// 修改风格套餐信息
export const rqeditStyleHourse = data =>
  $http.put2(`/v1/management/stylePackages/stylePackage/${data.id}`, data);

// 删除风格套餐信息
export const rqdeletestyleHourse = data =>
  $http.delete(`/v1/management/stylePackages/stylePackage/${data.id}`, data);

// 风格套餐列表
export const rqstyleHourseList = data =>
  $http.post('/v1/management/stylePackages/page', data);

// 风格套餐列表上下架
export const rqstyleHourseListStatus = data =>
  $http.put(
    `/v1/management/stylePackages/stylePackage/status/${data.id}`,
    data
  );

// 风格套餐详情
export const rqstyleHourseInfo = data =>
  $http.get(`/v1/management/stylePackages/stylePackage/${data.id}`);
