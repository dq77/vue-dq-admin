<template>
  <div class="order-pay">
    <el-card class="box-card">
      <div slot="header" class="title-info">
        <span>支付信息</span>
      </div>
      <div class="info-content">
        <table class="table">
          <tr>
            <td class="table-td-bgcolor">应付金额</td>
            <td>--</td>
            <td class="table-td-bgcolor">已付方式</td>
            <td>--</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">预授金额</td>
            <td>--</td>
            <td class="table-td-bgcolor">已付金额</td>
            <td>--</td>
          </tr>
        </table>
        <el-table border>
          <el-table-column label="账期"/>
          <el-table-column label="账期时间"/>
          <el-table-column label="应付金额"/>
          <el-table-column label="支付单号"/>
          <el-table-column label="第三方交易流水号"/>
          <el-table-column label="实际支付时间"/>
          <el-table-column label="逾期天数"/>
          <el-table-column label="状态"/>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .order-pay {
    .box-card {
      margin-bottom: 16px;
      .table{
        width: 100%;
        margin-bottom: 20px;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        tr td:nth-of-type(1){
          width: 12%;
        }
        tr td:nth-of-type(3){
          width: 12%;
        }
      }
      .table-td-bgcolor{
        background: #FAFAFA;
      }
      .table tr td{
        border: 1px solid #ebeef5;
        text-align: center;
        height:36px;
        font-size: 12px;
        color: #606266;
        padding: 0 6px;
        box-sizing: border-box;
      }
      .title-info {
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
      }
      .order-status {
        margin-left: 40px;
        color: orange;
      }
    }
  }
</style>
