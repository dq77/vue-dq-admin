<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="outstock-log">
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>订单日志</span>
      </div>
      <div class="info-content">
        <el-table :data="logObj.goods" border style="width:100%">
          <el-table-column label="SKUID" prop="skuId" />
          <el-table-column label="商品编码" prop="goodsCode" />
          <el-table-column label="数量" prop="quantity" />
          <el-table-column prop="xxxxxxxx" label="物流单号" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    logObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  watch: {
    logObj: {
      handler(value) {
        this.baseInfo = value;
      },
      deep: true
    }
  },
  methods: {}
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.outstock-log {
  .box-card {
    margin: 16px 0;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
  }
}
</style>
