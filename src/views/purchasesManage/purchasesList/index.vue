<template>
  <!-- 上方操作和筛选区 -->
  <div class="purchaseContent">
    <el-card class="search-container" shadow="hover">
      <el-form :model="params" :inline="true">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item :label="$t('financial.businessNo')">
              <el-input v-model.trim="params.purchaseNo" :placeholder="$t('financial.iptbusinessNo')" class="input-200" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('financial.suppliername')">
              <el-input v-model.trim="params.supplierKeyword" :placeholder="$t('financial.iptsuppliername')" class="input-200" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('good.goodname')">
              <el-input v-model.trim="params.goodsKeyword" :placeholder="$t('good.iptgoodname')" class="input-200" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('purchasesManage.purchasestatus')">
              <el-select v-model="params.purchaseStatus" :placeholder="$t('purchasesManage.iptpurchasestatus')" class="input-200">
                <el-option :label="$t('common.all')" value />
                <el-option :label="$t('purchasesManage.saved')" value="SAVED" />
                <el-option :label="$t('purchasesManage.partin')" value="PART_IN_WAREHOUSE" />
                <el-option :label="$t('warehouse.isinstock')" value="ALL_IN_WAREHOUSE" />
                <el-option :label="$t('warehouse.waitforinstock')" value="SUBMITTED" />
                <el-option :label="$t('warehouse.isbroke')" value="INVALID" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('financial.settlestatus')">
              <el-select v-model="params.settlementStatus" :placeholder="$t('financial.iptsettlestatus')" class="input-200">
                <el-option :label="$t('common.all')" value />
                <el-option :label="$t('financial.settled')" value="SETTLED" />
                <el-option :label="$t('financial.unsettlement')" value="UNBALANCED" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('purchasesManage.purchaseday')">
              <el-date-picker v-model="time" class="input-200" value-format="yyyy-MM-dd" type="daterange" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="text-align:right">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search()">{{ $t('common.find') }}</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="addNewPurchase()">{{ $t('common.new') }}</el-button>
        </el-row>
      </el-form>
    </el-card>
    <div class="stockmanager-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('financial.businessNo')" prop="purchaseNo" align="center" show-overflow-tooltip />
        <el-table-column :label="$t('financial.suppliername')" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.supplier &&scope.row.supplier.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good.good')" prop="goodName" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <el-button slot="reference" type="text">
                <span class="blue pointer">{{ scope.row.goodsLists && scope.row.goodsLists.length>0 && scope.row.goodsLists[0].name || '' }}...</span>
              </el-button>
              <el-table :data="scope.row.goodsLists" border style="width: 100%;">
                <el-table-column label="skuId" width="150px" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.skuId }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.goodcode')" width="150px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodsCode }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('warehouse.goodnamespec')" width="150px" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span style="margin-right:10px;">{{ scope.row.name }}</span>
                    <span>{{ scope.row.specification }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.purchaseoneprice')" width="150px" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.purchaseamount')" width="150px" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.quantity }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('purchasesManage.goodtotalprice')" width="150px" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.totalPrice }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchasesManage.purchaseamount')" prop="goodsQuantity" align="center" />
        <el-table-column :label="$t('purchasesManage.shouldpayprice')" prop="goodsTotalPrice" align="center" />
        <el-table-column :label="$t('purchasesManage.logisticsFee')" prop="logisticsFee" align="center" />
        <el-table-column :label="$t('purchasesManage.purchaseTotalPrice')" prop="purchaseTotalPrice" align="center" />
        <el-table-column :label="$t('common.creatTime')" prop align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createdRecord && scope.row.createdRecord.time }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.instockwarehouse')" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stockInWarehouse && scope.row.stockInWarehouse.name }}</template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.planinstocktime')" prop="plannedWarehousingDate" align="center" show-overflow-tooltip />
        <el-table-column :label="$t('purchasesManage.purchasestatus')" prop="purchaseStatus" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.purchaseStatus | purchaseStatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('financial.settlestatus')" prop="id" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.settlementStatus | settlementStatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.remark')" prop="remark" align="center" show-overflow-tooltip />
        <el-table-column :label="$t('common.actions')" min-width="250px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="view(scope.row)">{{ $t('common.see') }}</el-button>
            <el-button v-if="scope.row.purchaseStatus==='SAVED'" type="primary" plain @click="submit(scope.row)">{{ $t('common.submit') }}</el-button>
            <el-button v-if="scope.row.purchaseStatus==='SAVED'" type="info" plain @click="edit(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button v-if="scope.row.purchaseStatus==='SAVED'" type="danger" plain @click="deleted(scope.row)">{{ $t('common.delete') }}</el-button>
            <el-button v-if="scope.row.purchaseStatus==='SUBMITTED'" type="danger" plain @click="cancel(scope.row)">{{ $t('common.cancel') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import {
  rqPurchaseList, // 采购单列表
  rqSubmitPurchase, // 提交采购单
  rqCancelPurchase, // 取消采购单
  rqDeletedPurchase // 删除采购单
} from '@/api/purchase/index';
export default {
  components: {
    pagination
  },
  data() {
    return {
      loading: false,
      params: {
        purchaseNo: '', // 采购单编号
        supplierName: '', // 供应商名称
        goodsKeyword: '', // 商品名称
        purchaseStatus: '', // 采购状态
        settlementStatus: '' // 结算状态
      },
      time: '',
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表信息
    getList() {
      this.loading = true;
      const params = {
        ...this.params,
        ...this.listQuery,
        startTime: this.time ? this.time[0] : '',
        endTime: this.time ? this.time[1] : ''
      };
      rqPurchaseList({ ...params }).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords || 0;
        }
      });
    },

    // 新增采购
    addNewPurchase() {
      this.$router.push('purchasesList/newPurchase');
    },

    // 查询条件
    search() {
      this.getList();
    },

    // 查看
    view(row) {
      this.$router.push(`purchasesList/purchaseDetail/${row.purchaseId}`);
    },

    // 提交
    submit(row) {
      this.$confirm(
        this.$t('purchasesManage.submittostock'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: row.purchaseId,
          version: row.version
        };
        rqSubmitPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('purchasesManage.submitsucc'));
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 编辑
    edit(row) {
      this.$router.push({
        name: 'purchasesList/newPurchase',
        query: { purchaseId: row.purchaseId }
      });
    },

    // 删除
    deleted(row) {
      this.$confirm(
        this.$t('purchasesManage.confirmdelpurch'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: row.purchaseId,
          version: row.version
        };
        rqDeletedPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'));
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 取消
    cancel(row) {
      this.$confirm(
        this.$t('purchasesManage.confirmcancel'),
        this.$t('common.tips'),
        {}
      ).then(() => {
        const params = {
          purchaseId: row.purchaseId,
          version: row.version
        };
        rqCancelPurchase({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('purchasesManage.cancelsuccess'));
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.purchaseContent {
  padding: 15px;

  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    border: 1px solid #ebeef5;
    overflow: auto;

    .distpicker {
      select {
        cursor: pointer;
        color: #606266;
        font-size: 12px;
        min-width: 100px;
        padding: 0 10px;
        text-align: center;
        height: 28px;
        line-height: 26px;
        -webkit-appearance: none;
        -moz-appearance: none;
      }
      select:hover {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
      select:focus {
        outline: none;
      }
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .stockmanager-table {
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ebeef5;
    display: flex;
    flex-direction: column;
    // flex: 1;
  }
}
</style>
