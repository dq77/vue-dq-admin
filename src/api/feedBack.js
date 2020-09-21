import $http from '@/utils/http.js'

export default {

  // 获取意见列表
  getFeedList(data) {
    return $http.get(`/background/admin/get_suggest_list`, data);
  }
}
