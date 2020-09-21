import $http from '@/utils/http.js'
export default {
  riskaList() {
    return $http.get(`/risk/risk_query`, {})
  },
  // 省市区规则查询
  riskaArea(data) {
    return $http.post(`/risk/risk_area_query`, data)
  },
  // 省市区规则修改
  areaUpdate(data) {
    return $http.post(`/risk/update_province_rule`, data);
  },
  // 普通规则修改
  ruleModify(data) {
    return $http.post(`/risk/risk/rule/modify`, data);
  },
  enableRule(riskCode) {
    return $http.put(`/risk/enable_rule/${riskCode}`, {})
  },
  cancelRule(riskCode) {
    return $http.put(`/risk/disable_rule/${riskCode}`, {})
  },
  getDetail(data) {
    return $http.get(`/risk/order_risk_info`, data)
  },
  getHistoryDetail(data) {
    return $http.get(`/risk/order_history_info`, data)
  },
  // allowedRisk(data) {
  //   return $http.put(`/risk/risk_pass`, data)
  // },
  // refuseRisk(data) {
  //   return $http.put(`/risk/risk_refuse`, data)
  // },
  // 风控审核通过、拒绝、职位处理中都用同一个借口
  riskOperation(data) {
    return $http.post(`/risk/process`, data);
  },
  // 查询风控规则详情
  viewAreaRisk() {
    return $http.get(`/risk/risk_area_info`, {});
  },
  // 主动查询前海数据
  selfSearchQianHai(data) {
    return $http.get(`/risk/query_qianhai/${data.orderNo}`, data)
  },
  // 单独查询前海详情
  searchQianHai(data) {
    return $http.get(`/risk/qianhai_info/${data.orderNo}`, data)
  },
  // 查询木槿风控详情
  searchMuJin(data) {
    return $http.get(`/risk/mujin_info/${data.orderNo}`, data)
  },
  // 同盾风控
  searchTongDun(data) {
    return $http.get(`/risk/tongdun_info/${data.orderNo}`, data)
  }
}
