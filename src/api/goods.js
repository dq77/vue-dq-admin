import $http from '../utils/http';
// import { baseApiUrl } from '../common/config'

export default {

  // 获取类目列表
  getCategoryList(data) {
    return $http.get(`/goods/category/list`, data);
  },
  // 新增类目
  addCategory(data) {
    return $http.post(`/goods/add`, data);
  },
  // 类目编辑
  updateCategory(id, data) {
    return $http.post(`/goods/category/edit`, data);
  },
  // 类目删除
  deleteCategory(id) {
    return $http.delete(`/goods/category/del/${id}`, {});
  },
  // 属性列表
  attributeList(data) {
    return $http.get(`/goods/property_management/list`, data);
  },
  // 属性修改
  updateAtrribute(data) {
    return $http.post(`/goods/property_management/modify`, data);
  },
  // 属性新增
  addAtrribute(data) {
    return $http.post(`/goods/property_management/add`, data);
  },
  // 属性删除
  deleteAtrribute(id) {
    return $http.put(`/goods/specification_key/delete/${id}`, {});
  },
  // 品牌列表
  brandList(data) {
    return $http.get(`/goods/brand_management/list`, data);
  },
  // 新增品牌
  addBrand(data) {
    return $http.post(`/goods/brand_management/add`, data);
  },
  // 品牌修改
  updateBrand(data) {
    return $http.post(`/goods/brand_management/edit`, data);
  },
  // 品牌删除
  deleteBrand(id) {
    return $http.delete(`/goods/brand_management/${id}`, {});
  },
  // 前台展示类目列表
  showCategory() {
    return $http.get(`/goods/channel_category_list/`, {});
  },
  // 修改展示类目
  updateShowCategory(data) {
    return $http.post(`/goods/front_show_category/edit`, data);
  },
  // 获取后台配置类目下拉框
  selectCategory() {
    return $http.get(`/goods/category_not_label`, {});
  },
  // 查询类目档案
  getCategories(data) {
    return $http.get(`/management/categories/pageable/${data.page}-${data.pageSize}`, data);
  },
  // 新建类目档案
  addCategories(data) {
    return $http.post(`/management/categories`, data);
  },
  // 编辑类目档案
  editCategories(data) {
    return $http.put2(`/management/categories`, data);
  },
  // 删除类目档案
  deleteCategories(data) {
    return $http.delete(`/management/categories/${data.id}`);
  },
  // 启用类目档案
  enablecategory(data) {
    return $http.put2(`/management/categories/enable`, data);
  },
  // 禁用类目档案
  disablecategory(data) {
    return $http.put2(`/management/categories/disable`, data);
  },
  // 获取渠道的下拉框
  getChannel() {
    return $http.get(`/goods/channel_list`, {});
  },
  // 前台展示类目编辑时获取类目下拉框
  getCategoryDrop() {
    return $http.get(`/goods/category_drop`, {})
  },
  // 前台展示和后台展示类目映射
  categoryMapping(data) {
    return $http.get(`/goods/front_show_category/admin_get_detail`, data)
  },
  // 类目置顶操作
  toTop(id) {
    return $http.put(`/goods/user_category/${id}`, {})
  },
  // 租用商品列表
  goodsList(data) {
    return $http.post(`/goods/management/list`, data)
  },
  // 前台展示类目编辑页面删除接口
  delShowCategory(id) {
    return $http.post(`/goods/front_show_category/del/${id}`, {})
  },
  // 前台类目管理添加
  addShowCategory(data) {
    return $http.post(`/goods/front_show_category/add`, data)
  },
  // 租用商品的详情
  goodsDetail(no) {
    return $http.get(`/goods/detail_goods/${no}`, {})
  },
  offShelf(no) {
    return $http.post(`/goods/spu/off_shelf/${no}`, {})
  },
  onShelf(no) {
    return $http.post(`/goods/spu/on_shelf/${no}`, {})
  },
  // 编辑商品
  modifyGoods(data) {
    return $http.post(`/goods/modify_goods`, data)
  },
  // 添加商品
  addGoods(data) {
    return $http.post(`/goods/new_goods`, data);
  },
  // 品牌下拉框
  brandDrop() {
    return $http.get(`/goods/brand_management/drop_list`, {})
  },
  // 编辑获取详情接口
  editDetail(no) {
    return $http.get(`/goods/edit_detail_goods/${no}`, {})
  },
  // 商品的普通搜索
  searchGoods(key) {
    return $http.get(`/goods/spu/spu_list_search/${key}`, {})
  },
  // 根据渠道和租期搜索商品列表
  getGoodsByChannelAndStage(data) {
    return $http.post(`/goods/spu/spu_activity/list`, data)
  },
  // 根据spu列表搜索商品列表
  getGoodsBySpuList(data) {
    return $http.post(`/goods/spu/participate_activity/spu_list`, data)
  },
  // 根据商品no获取sku
  skuList(no) {
    return $http.get(`/goods/sku/admin_get_sku/${no}`, {})
  },
  // 优惠券时选择部分商品时获取商品列表
  CouponGoodsList(data) {
    return $http.post(`/goods/spu/spu_list_channels`, data);
  },
  // 商品操作日志
  goodsOperate(data) {
    return $http.get(`/goods/log/goods_change_log`, data)
  },
  // 售卖商品的费率
  saleRate() {
    return $http.get(`/goods/sku/rate_list/category`, {})
  },
  // 租赁商品费率
  renewalRate() {
    return $http.get(`/goods/sku/coefficient_list/category`, {})
  },
  // 商品编辑和新增页面的自定义规格
  customProperty(data) {
    return $http.post(`/goods/property_management/custom_add`, data);
  },
  // 提交售后默认模板
  defaultTemplate(data) {
    return $http.post(`/goods/upload_after_sale`, data)
  },
  // 获取默认图片
  getDefaultTemplate() {
    return $http.get(`/goods/get_img_after_sale`, {})
  },
  // 查看类目操作日志
  categoryLog(id) {
    return $http.get(`/management/categories/${id}/operation_records`)
  },
  // 运费相关

  // 获取运费列表
  getShippingTemplateList(data) {
    return $http.get(`/management/shipping-templates/pageable/${data.page}-${data.pageSize}`)
  },
  // 获取税费列表
  getTaxTemplateList(data) {
    return $http.get(`/management/tax-rates/pageable/${data.page}-${data.pageSize}`)
  },
  // 添加运费规则
  addShippingTemplate(data) {
    return $http.post(`/management/shipping-templates/PATH_LENGTH`, data)
  },
  // 编辑运费规则
  editShippingTemplate(data) {
    return $http.put2(`/management/shipping-templates/PATH_LENGTH`, data)
  },
  // 添加税费规则
  addTaxingTemplate(data) {
    return $http.post(`/management/tax-rates`, data)
  },
  // 编辑税费规则
  editTaxingTemplate(data) {
    return $http.put2(`/management/tax-rates`, data)
  },
  // 上架运费规则
  enableFreightTemplate(data) {
    return $http.put2(`/management/shipping-templates/enable`, data)
  },
  // 下架运费规则
  disableFreightTemplate(data) {
    return $http.put2(`/management/shipping-templates/disable`, data)
  },
  // 删除运费规则
  delFreightTemplate(data) {
    return $http.delete(`/management/shipping-templates/${data.id}`, data)
  },
  // 上架税费规则
  enableTaxingTemplate(data) {
    return $http.put2(`/management/tax-rates/enable`, data)
  },
  // 下架税费规则
  disableTaxingTemplate(data) {
    return $http.put2(`/management/tax-rates/disable`, data)
  },
  // 删除税费规则
  delTaxingTemplate(data) {
    return $http.delete(`/management/tax-rates/${data.id}`, data)
  },
  
};
