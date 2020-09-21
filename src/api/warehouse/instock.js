import $http from '@/utils/http.js'

export default {
  // 分页查询入库单信息
  getInstockList(data) {
    const str = data.status === 'SUBMITTED' ? '/group' : ''
    return $http.get(`/v1/stock_in${str}/pageable/${data.page}-${data.pageSize}`, data);
  },
  // 查询入库单详情信息
  getInstockDetail(data) {
    const str = data.status === 'SUBMITTED' ? '/group' : ''
    return $http.get(`/v1/stock_in${str}/${data.stockInId}`);
  },
  // 入库操作
  instockGoods(data) {
    return $http.put2(`/v1/stock_in/put_in`, data);
  },
  // 作废入库单
  breakInstock(data) {
    return $http.put2(`/v1/stock_in/break`, data)
  },
  // 手动新增入库单
  creatInstock(data) {
    return $http.post(`/v1/stock_in`, data)
  }

}
