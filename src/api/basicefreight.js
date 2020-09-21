/*
 * @Author: 刁琪
 * @Date: 2020-07-29 15:21:00
 * @LastEditors: わからないよう
 */
import $http from '../utils/http';

// 运费模板下拉框列表
export const dropdownFaretemplatelist = data =>
  $http.get(`/goods/fare_template/get_fare_list`, {});
