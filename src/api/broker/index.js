/*
 * @Author: 刁琪
 * @Date: 2020-08-21 15:11:10
 * @LastEditors: わからないよう
 */
import $http from '../../utils/http';

//  创建经纪人
export const rqCreateBroker = data =>
  $http.post(`/v1/management/brokers`, data);

// 编辑经纪人
export const rqBrokerListupdate = data =>
  $http.put2(`/v1/management/brokers`, data);

// 详情
export const rqBrokerDetail = data =>
  $http.get(`/v1/management/brokers/${data.id}`, data);

// 启用经纪人
export const rqBrokerListenable = data =>
  $http.put2(`/v1/management/brokers/enable`, data);

// 禁用经纪人
export const rqBrokerListdisenable = data =>
  $http.put2(`/v1/management/brokers/disable`, data);

// 分页查询
export const rqBrokerList = data =>
  $http.get(`/v1/management/brokers/pageable/${data.page}-${data.size}`, data);

//  创建佣金配置
export const creatCommissions = data =>
  $http.post(`/management/commission-templates`, data);

//  修改佣金配置
export const editCommissions = data =>
  $http.put2(`/management/commission-templates`, data);

//  删除佣金配置
export const delCommissions = data =>
  $http.delete(`/management/commission-templates/${data.id}`, data);

// 让利策略分页查询
export const getCommissionList = data =>
  $http.get(`/management/commission-templates/pageable/${data.page}-${data.size}`, data);

// 启用佣金配置
export const commissionsEnable = data =>
  $http.put2(`/management/commission-templates/enable`, data);

// 禁用佣金配置
export const commissionsDisable = data =>
  $http.put2(`/management/commission-templates/disable`, data);
