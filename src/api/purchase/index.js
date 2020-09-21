import $http from '../../utils/http';

// ##管理后台-采购管单
// 新建采购单
export const rqsaveNewPurchase = data => $http.post(`/v1/purchase`, data);

// 编辑更新采购单
export const rqeditOldPurchase = data => $http.put2(`/v1/purchase`, data);

// 根据 ID 采购单详情
export const rqpurchaseDetail = data =>
  $http.get(`/v1/purchase/${data.purchaseId}`, data);

// 取消采购单
export const rqCancelPurchase = data => $http.put2(`/v1/purchase/break`, data);

// 手动完结采购单
export const rqEndPurchase = data => $http.put2(`/v1/purchase/finish`, data);

// 删除采购单
export const rqDeletedPurchase = data => $http.delete(`/v1/purchase`, data);

// 分页查询采购单列表
export const rqPurchaseList = data =>
  $http.get(`/v1/purchase/pageable/${data.page}-${data.pageSize}`, data);

// 提交采购单
export const rqSubmitPurchase = data => $http.put2(`/v1/purchase/submit`, data);

// 导出序列号
export const downloadpurchaseUrl = data => $http.get(`/v1/purchase/${data}/assets/downloadUrl`);

//  ## 管理后台-企业管理
// 新建供应商
export const rqSaveNewEnterprises = data => $http.post(`/v1/enterprises`, data);
// 新建用户
export const rqSaveNewUser = data => $http.post(`/v1/user`, data);

// 编辑供应商企业
export const rqEditEnterprises = data => $http.put2(`/v1/enterprises`, data);

// 查询供应商企业
export const rqGetEnterprises = data =>
  $http.get(`/v1/enterprises/pageable/${data.page}-${data.pageSize}`, data);

// 根据企业ID查询企业详情
export const rqEnterPrisesDetail = data =>
  $http.get(`/v1/enterprises/${data.id}`, data);

// 启用某一合作模式
export const rqEnterpriseScooperate = data =>
  $http.put2(`/v1/enterprises/cooperate`, data);

// 分页查询供应商企业
export const rqEnterprisesList = data =>
  $http.get(
    `/v1/enterprises/supplier/pageable/${data.page}-${data.pageSize}`,
    data
  );

// 对某一合作模式终止
export const rqTerminationEnterprises = data =>
  $http.put2(`/v1/enterprises/terminate`, data);
