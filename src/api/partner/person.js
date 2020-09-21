import $http from '@/utils/http'

export default {
  // 合伙人列表
  getList(data) {
    return $http.get(`/background/partnerUser/manage/list`, data);
  },
  // 编辑
  updatePerson(data) {
    return $http.post(`/background/partnerUser/manage/update`, data);
  },
  // 详情
  personDetail(id) {
    return $http.get(`/background/partnerUser/manage/detail/${id}`, {});
  },
  // 查看日志
  viewLog(id, data) {
    return $http.get(`/background/partnerUser/manage/log/${id}`, data);
  },
  // 重新合作
  reCooperation(id) {
    return $http.put(`/background/partnerUser/manage/join/${id}`, {});
  },
  // 取消合作
  unCooperation(id) {
    return $http.put(`/background/partnerUser/manage/un_join/${id}`, {});
  }
}
