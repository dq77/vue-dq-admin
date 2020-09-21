<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="outstock-base">
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>基本信息</span>
        <span v-if="baseObj.status == 'COMPLETED' || baseObj.status == 'INVALID'" style="margin-left:20px">出库单号：{{ baseObj.stockOutNo }}</span>
      </div>
      <div class="info-content">
        <table v-loading="false" class="table">
          <tr>
            <td class="table-td-bgcolor">业务来源</td>
            <td>{{ baseObj.situationDesc }}</td>
            <td class="table-td-bgcolor">业务单号</td>
            <td>{{ baseObj.businessNo }}</td>
            <td v-if="baseObj.status != 'COMPLETED' && baseObj.status != 'INVALID'" class="table-td-bgcolor">物流状态</td>
            <td v-if="baseObj.status != 'COMPLETED' && baseObj.status != 'INVALID'">
              <span v-if="baseObj.status == 'SAVED'">待预约快递</span>
              <span v-if="baseObj.status == 'BOOKED'">待打印发货单</span>
              <span v-if="baseObj.status == 'PRINTED'">待提交至出库流程</span>
              <span v-if="baseObj.status == 'SUBMITTED'">待出库</span>
            </td>
            <td v-if="baseObj.status == 'COMPLETED' || baseObj.status == 'INVALID'" class="table-td-bgcolor">出库单状态</td>
            <td v-if="baseObj.status == 'COMPLETED' || baseObj.status == 'INVALID'">{{ baseObj.statusDesc }}</td>
          </tr>
          <tr v-if="baseObj.status != 'COMPLETED' && baseObj.status != 'INVALID'">
            <td class="table-td-bgcolor">收货信息</td>
            <td>
              <span v-if="baseObj.freight&&baseObj.freight.receiverAddress">
                {{ baseObj.freight.receiverAddress.indexAndDetail[1] ||'--' }}
                {{ baseObj.freight.receiverAddress.indexAndDetail[2] ||'--' }}
                {{ baseObj.freight.receiverAddress.indexAndDetail[3] ||'--' }}
                {{ baseObj.freight.receiverAddress.districts[1].name ||'--' }}
              </span>
            </td>
            <td class="table-td-bgcolor">创建时间</td>
            <td v-if="baseObj.createdRecord">{{ baseObj.createdRecord.time }}</td>
            <td class="table-td-bgcolor">收件方信息</td>
            <td>
              <span v-if="baseObj.freight&&baseObj.freight.receiver">
                {{ baseObj.freight.receiver.name }}
                {{ baseObj.freight.receiver.mobile }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">出库仓库</td>
            <td>{{ baseObj.warehouse ? baseObj.warehouse.name : '--' }}</td>
            <td class="table-td-bgcolor">出库时间</td>
            <td>{{ baseObj.stockedOutRecord ? baseObj.stockedOutRecord.time : '--' }}</td>
            <td class="table-td-bgcolor">出库操作人</td>
            <td>{{ baseObj.stockedOutRecord ? baseObj.stockedOutRecord.operatorName : '--' }}</td>
          </tr>
          <tr v-if="baseObj.status == 'INVALID'">
            <td class="table-td-bgcolor">作废时间</td>
            <td>{{ baseObj.brokeRecord.time }}</td>
            <td class="table-td-bgcolor">作废操作人</td>
            <td>{{ baseObj.brokeRecord.operatorName }}</td><td class="table-td-bgcolor"></td><td></td>
          </tr>
          <tr v-if="baseObj.status !== 'COMPLETED' && baseObj.status !== 'ARCHIVED' && baseObj.status !== 'INVALID'">
            <td class="table-td-bgcolor">用户备注</td>
            <td>{{ baseObj.buyerRemark || '--' }}</td>
            <td class="table-td-bgcolor">客服备注</td>
            <td>
              <a v-if="baseObj.sellerRemarks && baseObj.sellerRemarks[0]" href="javascript:;" @click="remarkView(baseObj.sellerRemarks)">
                <span class="orderRemark">{{ baseObj.sellerRemarks[0].content }}</span>
              </a>
            </td><td class="table-td-bgcolor"></td><td></td>
          </tr>
        </table>
        <el-dialog :visible.sync="remarkDialog" title="客服备注" center>
          <el-table :data="remarkObj" border>
            <el-table-column label="时间" prop="operateTime"/>
            <el-table-column label="内容" prop="content"/>
            <el-table-column label="操作人" prop="username"/>
          </el-table>
          <div slot="footer">
            <el-button type="info" @click="cancel()">关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    baseObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      remarkDialog: false, // 客服备注
      remarkObj: {
        operateTime: '',
        content: '',
        userName: ''
      }
    }
  },
  watch: {
    baseObj: {
      handler(value) {
        this.baseInfo = value;
      },
      deep: true
    }
  },
  methods: {
    // 查看客服备注
    remarkView(value) {
      this.remarkDialog = true;
      this.remarkObj = value;
    },
    // 关闭备注弹窗
    cancel() {
      this.remarkDialog = false;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .outstock-base {
    .box-card {
      margin: 16px 0;
      .table-td-bgcolor{
        background: #FAFAFA;
      }
      .table{
        width: 100%;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        .orderRemark {
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #4da9ec;
        }
        tr td:nth-of-type(2n+1){
          width: 12%;
        }
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
    }
  }
</style>
