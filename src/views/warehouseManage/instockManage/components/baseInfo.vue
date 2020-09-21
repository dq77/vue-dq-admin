<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="instock-base">
    <el-card class="box-card">
      <div slot="header" class="base-info title-info">
        <span>{{ $t('good.baseInfo') }}</span>
        <span v-if="baseobj.status == 'COMPLETED' || baseobj.status == 'ARCHIVED'" style="margin-left:20px">{{ $t('warehouse.instockid') }}: {{ baseobj.stockInNo }}</span>
      </div>
      <div v-if="baseobj.status" class="info-content">
        <table class="table">
          <tr>
            <td class="table-td-bgcolor">{{ $t('warehouse.bsnsfrom') }}</td>
            <td>{{ baseobj.situationDesc }}</td>
            <td class="table-td-bgcolor">{{ $t('warehouse.businessNo') }}</td>
            <td>{{ baseobj.businessNo }}</td>
            <td class="table-td-bgcolor">{{ $t('warehouse.instockstatus') }}</td>
            <td>{{ baseobj.statusDesc }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('warehouse.supplier') }}</td>
            <td>{{ baseobj.supplier?baseobj.supplier.name:'--' }}</td>
            <td class="table-td-bgcolor">{{ $t('warehouse.instockwarehouse') }}</td>
            <td>{{ baseobj.warehouse?baseobj.warehouse.name:'--' }}</td>
            <td class="table-td-bgcolor">{{ $t('warehouse.planinstocktime') }}</td>
            <td>{{ baseobj.plannedWarehousingDate }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">{{ $t('common.creatTime') }}</td>
            <td>{{ baseobj.createdRecord?baseobj.createdRecord.time:baseobj.gmtCreated }}</td>
            <td v-if="baseobj.status=='SUBMITTED'" class="table-td-bgcolor">{{ $t('warehouse.freightType') }}</td>
            <td v-if="baseobj.status=='SUBMITTED'">{{ baseobj.freight?baseobj.freight.freightProviderDesc:'--' }}</td>
            <td v-if="baseobj.status=='SUBMITTED'" class="table-td-bgcolor">{{ $t('warehouse.trackingNo') }}</td>
            <td v-if="baseobj.status=='SUBMITTED'">{{ baseobj.freight && baseobj.freight.trackingNo ? baseobj.freight.trackingNo : '--' }}</td>

            <td v-if="baseobj.status!='SUBMITTED'" class="table-td-bgcolor">{{ $t('warehouse.realinstocktime') }}</td>
            <td v-if="baseobj.status!='SUBMITTED'">{{ baseobj.warehousingRecord?baseobj.warehousingRecord.time:'--' }}</td>
            <td v-if="baseobj.status!='SUBMITTED'" class="table-td-bgcolor">{{ $t('warehouse.instockrecord') }}</td>
            <td v-if="baseobj.status!='SUBMITTED'">{{ baseobj.warehousingRecord?baseobj.warehousingRecord.operatorName:'--' }}</td>
          </tr>
          <tr v-if="baseobj.status=='INVALID'">
            <td class="table-td-bgcolor">{{ $t('warehouse.broketime') }}</td>
            <td>{{ baseobj.brokeRecord.time }}</td>
            <td class="table-td-bgcolor">{{ $t('warehouse.brokerecord') }}</td>
            <td>{{ baseobj.brokeRecord.operatorName }}</td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    baseobj: {
      type: Object,
      // eslint-disable-next-line
      default: {}
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.baseInfo = this.baseobj
  },
  methods: {

  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .instock-base {
    .box-card {
      margin: 16px 0;
      .table-td-bgcolor{
        background: #FAFAFA;
      }
      .table{
        width: 100%;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
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
