<template>
  <div class="pageContent">
    <div class="purchase">
      <div class="header">
        <div class="endbtn">
          <el-button v-if="purchaseDetail.purchaseStatus === 'PART_IN_WAREHOUSE'" type="primary" size="medium" @click="endpurchase()">&nbsp;{{ $t('purchasesManage.endpurchase') }}&nbsp;</el-button>
        </div>
        <div class="header_text">{{ $t('purchasesManage.purchaseitemdetail') }}</div>
      </div>
      <div class="main">
        <el-card shadow="hover" class="Card">
          <div slot="header" class="header_text">
            <span>{{ $t('purchasesManage.purchasebaseinfo') }}</span>
          </div>
          <table v-loading="false" class="table">
            <tr>
              <td class="table-td-bgcolor">{{ $t('warehouse.purchaseId') }}</td>
              <td>{{ purchaseDetail.purchaseNo || '--' }}</td>
              <td class="table-td-bgcolor">{{ $t('purchasesManage.purchasestatus') }}</td>
              <td>{{ purchaseDetail.purchaseStatus | purchaseStatusFilter }}</td>
              <td class="table-td-bgcolor">{{ $t('financial.settlestatus') }}</td>
              <td>{{ purchaseDetail.settlementStatus | settlementStatusFilter }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">{{ $t('financial.suppliername') }}</td>
              <td>{{ purchaseDetail.supplier && purchaseDetail.supplier.name }}</td>
              <td class="table-td-bgcolor">{{ $t('warehouse.instockwarehouse') }}</td>
              <td>{{ purchaseDetail.stockInWarehouse &&purchaseDetail.stockInWarehouse.name|| '--' }}</td>
              <td class="table-td-bgcolor">{{ $t('warehouse.planinstocktime') }}</td>
              <td>{{ purchaseDetail.plannedWarehousingDate || '--' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">{{ $t('purchasesManage.settleperiod') }}</td>
              <td>
                {{ purchaseDetail.settlementStrategy && purchaseDetail.settlementStrategy.baseTimeStrategy === 'BILL_DATE' ? '按采购单提交时间' : '' }}
                {{ purchaseDetail.settlementStrategy && purchaseDetail.settlementStrategy.baseTimeStrategy === 'RECEIPT_DATE' ? '按用户确认收货时间' : '' }}
                <strong style="color:#409EFF; margin: 0 5px;">/</strong>
                {{ purchaseDetail.settlementStrategy && (purchaseDetail.settlementStrategy.accountPeriodType === 'AFTER_TRANSACTION' ? `按 T+${purchaseDetail.settlementStrategy.periodDate}结算` : `按每月${purchaseDetail.settlementStrategy.periodDate}号结算`) }}
              </td>
              <td class="table-td-bgcolor">{{ $t('purchasesManage.purchasecontract') }}</td>
              <td>
                <a
                  v-for="item in (purchaseDetail.contract && Object.keys(purchaseDetail.contract)) "
                  :key="item"
                  :href="purchaseDetail.purchaseStatus==='INVALID' ? '' : item"
                  :download="purchaseDetail.purchaseStatus==='INVALID'? false:true"
                  :class="purchaseDetail.purchaseStatus==='INVALID' ? 'gray': 'blue'"
                >{{ purchaseDetail.contract[item] }}</a>
              </td>
              <td class="table-td-bgcolor">{{ $t('common.remark') }}</td>
              <td>
                <span>
                  <span style="margin-right:10px">{{ purchaseDetail.remark || '' }}</span>
                  <i v-if="purchaseDetail.purchaseStatus!=='INVALID'" class="el-icon-edit pointer blue" @click="editRemakes()" />
                </span>
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">{{ $t('purchasesManage.purchasecreater') }}</td>
              <td>{{ purchaseDetail.createdRecord && purchaseDetail.createdRecord.operatorName || '--' }}</td>
              <td class="table-td-bgcolor">{{ $t('common.creatTime') }}</td>
              <td>{{ purchaseDetail.createdRecord && purchaseDetail.createdRecord.time || '--' }}</td>
              <td class="table-td-bgcolor" />
              <td />
            </tr>
          </table>
        </el-card>
        <el-card shadow="hover" class="Card">
          <div slot="header" class="header_text">
            <span>{{ $t('purchasesManage.purchasegoodinfo') }}</span>
          </div>
          <good-table :tabledata="goodInfo" :bottominfo="bottominfo" />
        </el-card>
        <el-card shadow="hover" class="Card">
          <div slot="header" class="header_text">
            <span>{{ $t('purchasesManage.instocklog') }}</span>
          </div>
          <inbound-record :tabledata="stockInRecords" />
        </el-card>
        <el-card shadow="hover" class="Card">
          <div slot="header" class="header_text">
            <span>{{ $t('purchasesManage.settlements') }}</span>
          </div>
          <settlement-record :tabledata="settlements" />
        </el-card>
      </div>
      <div class="footer">
        <el-button type="primary" icon="el-icon-back" size="medium" @click="back()">{{ $t('common.back') }}</el-button>
        <div>
          <el-button v-if="purchaseDetail.purchaseStatus ==='SAVED'" type="danger" size="medium" @click="deleted()">{{ $t('common.delete') }}</el-button>
          <el-button v-if="purchaseDetail.purchaseStatus ==='SAVED'" type="primary" size="medium" @click="edit()">{{ $t('common.edit') }}</el-button>
          <el-button v-if="purchaseDetail.purchaseStatus ==='SAVED'" type="primary" size="medium" @click="submit()">{{ $t('common.submit') }}</el-button>
          <el-button v-if="purchaseDetail.purchaseStatus ==='SUBMITTED'" type="danger" size="medium" @click="cancel()">{{ $t('common.cancel') }}</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowremake" :before-close="handleClose" :title="$t('purchasesManage.remarkedit')" width="30%" center>
      <span>
        <el-input :rows="4" v-model="purchaseDetail.remark" type="textarea" maxlength="50" />
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleClose('ok')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import goodTable from './children/goodTable';
import inboundRecord from './children/InboundRecord';
import settlementRecord from './children/settlementRecord';
import {
  rqSubmitPurchase, // 提交采购单
  rqpurchaseDetail, // 查询详情
  rqCancelPurchase, // 取消采购单
  rqEndPurchase, // 手动完结采购单
  rqDeletedPurchase, // 删除采购单
  rqeditOldPurchase // 采购单更新
} from '@/api/purchase/index';

export default {
  components: {
    goodTable,
    inboundRecord,
    settlementRecord
  },
  inject: ['reload'],
  data() {
    return {
      isShowremake: false,
      purchaseDetail: {},
      stockInRecords: [], // 入库记录
      goodInfo: [], // 商品信息
      settlements: [], // 结算记录
      bottominfo: {}
    };
  },

  created() {},

  mounted() {
    this.fetchDetail();
  },

  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },

    // 查询详情
    fetchDetail() {
      const purchaseId = this.$route.params.purchaseId;
      rqpurchaseDetail({ purchaseId: purchaseId }).then(res => {
        if (res.code === 200) {
          this.purchaseDetail = res.data || [];
          this.stockInRecords = (res.data && res.data.stockInRecords) || []; // 入库记录
          this.goodInfo = (res.data && res.data.goodsLists) || []; // 采购商品信息
          this.settlements = (res.data && res.data.purchaseSettlements) || [];
          this.bottominfo = {
            // 货款合计 物流费用 合计数量 合计总额
            goodsQuantity: (res.data && res.data.goodsQuantity) || 0, // 合计数量
            goodsTotalPrice: (res.data && res.data.goodsTotalPrice) || 0, // 贷款合计
            logisticsFee: (res.data && res.data.logisticsFee) || 0, // 物流费用
            purchaseTotalPrice: (res.data && res.data.purchaseTotalPrice) || 0 // 合计总额
          };
        }
      });
    },

    // 删除
    deleted() {
      this.$confirm(
        this.$t('purchasesManage.delpurchasecfm'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: this.purchaseDetail.purchaseId,
          version: this.purchaseDetail.version
        };
        rqDeletedPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'));
            this.$router.go(-1);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 取消
    cancel() {
      this.$confirm(
        this.$t('purchasesManage.confirmcancel'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: this.purchaseDetail.purchaseId,
          version: this.purchaseDetail.version
        };
        rqCancelPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('purchasesManage.cancelsuccess'));
            this.reload();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 手动完结
    endpurchase() {
      this.$confirm(
        this.$t('purchasesManage.endpurchasecfm'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: this.purchaseDetail.purchaseId,
          version: this.purchaseDetail.version
        };
        rqEndPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('purchasesManage.endsuccess'));
            this.reload();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 提交
    submit() {
      this.$confirm(
        this.$t('purchasesManage.submittostock'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: this.purchaseDetail.purchaseId,
          version: this.purchaseDetail.version
        };
        rqSubmitPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('purchasesManage.submitsucc'));
            this.$router.go(-1);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    //  修改备注
    editRemakes() {
      this.isShowremake = true;
    },

    // 编辑采购
    edit() {
      this.$router.push({
        name: 'purchasesList/newPurchase',
        query: { purchaseId: this.$route.params.purchaseId }
      });
    },

    // 备注编辑窗口关闭回调
    handleClose(val) {
      if (val === 'ok') {
        const params = {
          // ...this.purchaseDetail,
          contract: this.purchaseDetail.contract,
          logisticFee: this.purchaseDetail.logisticsFee,
          plannedWarehousingDate: this.purchaseDetail.plannedWarehousingDate,
          remark: this.purchaseDetail.remark,
          settlementStrategy: this.purchaseDetail.settlementStrategy,
          submitted: this.purchaseDetail.purchaseStatus !== 'SAVED',
          goodsLists: this.purchaseDetail.goodsLists.map(item => ({
            skuId: Number(item.skuId),
            price: Number(item.price),
            quantity: Number(item.quantity)
          })),
          purchaseId: this.$route.params.purchaseId,
          supplierId: this.purchaseDetail.supplier.id,
          supplierMode: this.purchaseDetail.supplierMode,
          warehouseId: this.purchaseDetail.stockInWarehouse.id,
          version: this.purchaseDetail.version
        };
        rqeditOldPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'));
            this.isShowremake = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.isShowremake = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.purchase {
  background: #fff;
  height: 100%;
  overflow: auto;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  .header_text {
    border-left: 2px solid #2592fc;
    line-height: 16px;
    padding-left: 8px;
  }
  .header {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    .endbtn {
      float: right;
      margin: -10px 0 -10px 0;
    }
  }
  .main {
    padding: 15px;
    flex: 1;
    overflow: auto;
    .table {
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;
      tr td:nth-of-type(1) {
        width: 12%;
      }
      tr td:nth-of-type(2) {
        width: 20%;
      }
      tr td:nth-of-type(3) {
        width: 12%;
      }
    }
    .table-td-bgcolor {
      background: #fafafa;
    }
    .table tr td {
      border: 1px solid #ebeef5;
      text-align: center;
      height: 36px;
      font-size: 12px;
      color: #606266;
      padding: 0 6px;
      box-sizing: border-box;
    }
  }
  .footer {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: space-between;
  }
  .Card {
    margin-bottom: 15px;
  }
}
</style>
