import $http from '../../utils/http';

// 查询结算列表
export const rqsettltmentsList = data =>
  $http.get(`/v1/settlements/pageable/${data.page}-${data.pageSize}`, data);

// 查询结算单详情
export const rqsettlementsDetail = data =>
  $http.get(`/v1/settlements/${data.settlementId}`, data);

// 结算操作
export const rqsettlementsOpertion = data =>
  $http.put2('/v1/settlements/settle', data);
