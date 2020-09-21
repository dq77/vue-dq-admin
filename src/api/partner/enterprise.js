import $http from '@/utils/http'

export default {
  // 新增企业
  addEnterprise(data) {
    return $http.post(`/background/partner/manage/add`, data)
  },
  // 编辑企业
  updateEnterprise(id,data) {
    return $http.post(`/background/partner/manage/update/${id}`, data)
  },
  // 列表查询
  getList(data) {
    return $http.get(`/background/partner/manage/list`, data)
  },
  // 查看详情
  enterpriseDetail(id) {
    return $http.get(`/background/partner/manage/detail/${id}`, {})
  },
  // 查看日志
  viewLog(id,data) {
    return $http.get(`/background/partner/manage/log/${id}`,data)
  },
  // 企业下拉框
  enterpriseList() {
    return $http.get(`/background/partnerUser/partnerList`, {})
  },
  // 取消企业合作
  cancelCooperation(id) {
    return $http.get(`/background/partner/manage/un_join/${id}`, {})
  },
  // 重新合作
  cooperation(id) {
    return $http.get(`/background/partner/manage/join/${id}`, {})
  }
}
