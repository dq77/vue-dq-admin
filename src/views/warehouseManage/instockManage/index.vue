<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="instockmanager-container">
    <div class="search-container">
      <el-radio-group v-model="queryForm.status" class="risk-status-tab" @change="selectStatus">
        <el-radio-button label="SUBMITTED">{{ $t('warehouse.waitforinstock') }}</el-radio-button>
        <el-radio-button label="COMPLETED,ARCHIVED">{{ $t('warehouse.isinstock') }}</el-radio-button>
        <el-radio-button label="INVALID">{{ $t('warehouse.isbroke') }}</el-radio-button>
      </el-radio-group>
      <el-button class="new-btn" type="primary" @click="add()">{{ $t('warehouse.manualaddinstock') }}</el-button>
      <el-form :inline="true" label-width="150px">
        <el-form-item :label="$t('warehouse.bsnsfrom')">
          <el-select v-model="queryForm.situation" clearable>
            <el-option :label="$t('warehouse.buyinstock')" value="PURCHASE"/>
            <el-option :label="$t('warehouse.expiredback')" value="EXPIRED"/>
            <el-option :label="$t('warehouse.rejectback')" value="RETURN"/>
            <el-option :label="$t('warehouse.changegoodinstock')" value="EXCHANGE"/>
            <el-option :label="$t('warehouse.checkinstock')" value="COUNT"/>
            <el-option :label="$t('warehouse.allotinstock')" value="ALLOCATE"/>
            <el-option :label="$t('warehouse.otherinstock')" value="OTHER"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('warehouse.businessNo')">
          <el-input v-model="queryForm.businessNo" clearable/>
        </el-form-item>
        <el-form-item :label="$t('good.goodname')">
          <el-input v-model="queryForm.goodsKeyword" clearable/>
        </el-form-item>
        <el-form-item v-if="queryForm.status=='SUBMITTED'" :label="$t('common.creatTime')">
          <el-date-picker
            v-model="timeArr"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status=='SUBMITTED'" :label="$t('warehouse.planinstocktime')">
          <el-date-picker
            v-model="timeList"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getPlanTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status=='COMPLETED,ARCHIVED'" :label="$t('warehouse.instocktime')">
          <el-date-picker
            v-model="timeArr"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status=='INVALID'" :label="$t('warehouse.broketime')">
          <el-date-picker
            v-model="timeArr"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.status!='SUBMITTED'" :label="$t('warehouse.instockid')">
          <el-input v-model="queryForm.stockInNo" clearable />
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <!-- <el-button type="primary" @click="add()">新增</el-button> -->
      </div>
    </div>
    <div class="instockmanager-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column
          v-if="queryForm.status!='SUBMITTED'"
          key="1"
          :label="$t('warehouse.instockid')"
          prop="stockInNo"
        />
        <el-table-column key="2" :label="$t('warehouse.bsnsfrom')" prop="situationDesc">
          <template slot-scope="scope">
            <span>{{ scope.row.situationDesc }}</span>
            <span v-if="scope.row.instruction">[{{ scope.row.instruction }}]</span>
          </template>
        </el-table-column>
        <el-table-column key="3" :label="$t('warehouse.businessNo')" prop="businessNo"/>
        <el-table-column key="4" :label="$t('warehouse.supplier')" prop="supplier">
          <template slot-scope="scope">
            <div v-if="scope.row.supplier">
              {{ scope.row.supplier.name }}
              <span v-if="scope.row.supplierMode" style="color: #999"> {{ scope.row.supplierMode | supplierModeFilter }}</span>
            </div>
            <div v-else class="tac">--</div>
          </template>
        </el-table-column>
        <el-table-column key="5" :label="$t('good.goodname')" prop="goodsLists" width="150px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <el-button slot="reference" type="text" class="pop-btn">
                <span
                  v-for="( item, index ) in scope.row.goodsLists"
                  :key="item.skuId"
                >{{ index==0?'':'、' }}{{ item.name }}</span>
              </el-button>
              <el-table :data="scope.row.goodsLists" border style="width: 100%;">
                <el-table-column label="SKUID" width="100px" prop="skuId"/>
                <el-table-column :label="$t('warehouse.goodcode')" width="100px" prop="goodsCode"/>
                <el-table-column :label="$t('warehouse.goodnamespec')" width="200px">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                    <span v-if="scope.row.specification">[{{ scope.row.specification }}]</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="scope.row.status == 'SUBMITTED'"
                  :label="$t('warehouse.shouldinmun')"
                  width="100px"
                  prop="warehousingAmount"
                />
                <el-table-column :label="$t('warehouse.alreadayinstocknum')" width="100px" prop="insideWarehouseCount"/>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column key="6" :label="$t('warehouse.totalnum')" width="70px" prop="goodsCount"/>
        <el-table-column key="7" :label="$t('warehouse.instockwarehouse')" prop="warehouse">
          <template slot-scope="scope">
            <div v-if="scope.row.warehouse">{{ scope.row.warehouse.name }}</div>
          </template>
        </el-table-column>
        <el-table-column key="8" :label="$t('warehouse.instockstatus')" width="100px" prop="statusDesc">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.statusDesc !== null"
              :type="scope.row.status === 'SUBMITTED' ? 'primary' : (scope.row.status === 'COMPLETED'?'success':'info')"
            >{{ scope.row.status === 'SUBMITTED' ? $t('warehouse.waitforinstock') : scope.row.statusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="queryForm.status=='SUBMITTED'" key="9" :label="$t('warehouse.planinstocktime')" prop="plannedWarehousingDate"/>
        <el-table-column
          v-if="queryForm.status=='SUBMITTED'"
          key="10"
          :label="$t('common.creatTime')"
          prop="gmtCreated"
        >
          <template v-if="scope.row.gmtCreated" slot-scope="scope">{{ scope.row.gmtCreated }}</template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status!='SUBMITTED'"
          key="11"
          :label="$t('warehouse.instocktime')"
          prop="warehousingTime"
        >
          <template
            v-if="scope.row.warehousingRecord"
            slot-scope="scope"
          >{{ scope.row.warehousingRecord.time }}</template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status=='INVALID'"
          key="12"
          :label="$t('warehouse.broketime')"
          prop="brokeRecord"
        >
          <template v-if="scope.row.brokeRecord" slot-scope="scope">{{ scope.row.brokeRecord.time }}</template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status=='COMPLETED,ARCHIVED'"
          key="13"
          :label="$t('warehouse.instockrecord')"
          width="100px"
          prop="warehousingRecord"
        >
          <template
            v-if="scope.row.warehousingRecord"
            slot-scope="scope"
          >{{ scope.row.warehousingRecord.operatorName }}</template>
        </el-table-column>
        <el-table-column
          v-if="queryForm.status=='INVALID'"
          key="14"
          :label="$t('warehouse.brokerecord')"
          width="100px"
          prop="brokeRecord"
        >
          <template
            v-if="scope.row.brokeRecord"
            slot-scope="scope"
          >{{ scope.row.brokeRecord.operatorName }}</template>
        </el-table-column>
        <el-table-column key="15" :label="$t('common.actions')" min-width="120px" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status=='SUBMITTED'"
              type="primary"
              plain
              icon="el-icon-view"
              @click="view(scope.row)"
            >{{ $t('warehouse.seeandinstock') }}</el-button>
            <el-button
              v-if="scope.row.status !='SUBMITTED'"
              type="primary"
              plain
              icon="el-icon-view"
              @click="view(scope.row)"
            >{{ $t('common.see') }}</el-button>
            <el-button
              v-if="scope.row.status=='COMPLETED'"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="breakInstock(scope.row)"
            >{{ $t('warehouse.broke') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import instockApi from '@/api/warehouse/instock';
import { saveParameter } from '@/utils/saveParameter.js';
export default {
  components: {
    pagination
  },
  filters: {
    supplierModeFilter(val) {
      switch (val) {
        case 0: return '自营'
        case 1: return '代租售'
        case 2: return '代租售'
        case 3: return '代发货'
        default: return ''
      }
    }
  },
  data() {
    return {
      queryForm: {
        status: 'SUBMITTED',
        situation: '',
        goodsKeyword: '',
        businessNo: '',
        stockInNo: '',
        startTime: '',
        endTime: '',
        warehousingDateFrom: '',
        warehousingDateTo: ''
      },
      searchForm: {
        status: 'SUBMITTED',
        situation: '',
        goodsKeyword: '',
        businessNo: '',
        stockInNo: '',
        startTime: '',
        endTime: '',
        warehousingDateFrom: '',
        warehousingDateTo: ''
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 1,
      timeArr: [], // 广义时间范围
      timeList: [], // 计划入库时间范围
      tableData: [{}],
      loading: false,
      viewDialog: false // 详情弹窗
    };
  },
  created() {
    if (
      sessionStorage.getItem('pageFlag') &&
      sessionStorage.getItem('path') === this.$route.path
    ) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.searchForm = {
        ...parameter
      };
      this.queryForm = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      };
      if (parameter.startTime && parameter.endTime) {
        this.timeArr = [parameter.startTime, parameter.endTime];
      }
      if (parameter.warehousingDateFrom && parameter.warehousingDateTo) {
        this.timeList = [
          parameter.warehousingDateFrom,
          parameter.warehousingDateTo
        ];
      }
      sessionStorage.removeItem('pageFlag');
      sessionStorage.removeItem('path');
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表信息
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...this.searchForm
      };
      Object.keys(data).map(item => {
        data[item] === '' && delete data[item];
      });
      this.loading = true
      setTimeout(() => {
        instockApi.getInstockList(data).then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list || [];
            this.total = res.data.totalRecords;
          } else {
            this.$message.info(res.msg);
          }
          this.loading = false
        });
      }, 200)
    },

    // 查询条件
    search() {
      this.searchForm = {
        ...this.queryForm
      };
      this.listQuery.page = 1;
      this.getList();
    },
    // 入库单详情页
    view(value) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      const query = {};
      if (value.status === 'SUBMITTED') {
        query.groupId = value.groupId;
      } else {
        query.id = value.id;
      }
      this.$router.push({
        name: 'instockDetail',
        query
      });
    },
    // 广义时间选择
    getTime(value) {
      this.queryForm.startTime = value ? value[0] : '';
      this.queryForm.endTime = value ? value[1] : '';
    },
    // 计划入库时间选择
    getPlanTime(value) {
      this.queryForm.warehousingDateFrom = value ? value[0] : '';
      this.queryForm.warehousingDateTo = value ? value[1] : '';
    },
    // 切换入库单状态
    selectStatus() {
      this.resetForm();
      this.search();
    },

    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
    },

    // 作废
    breakInstock(row) {
      this.$confirm(this.$t('warehouse.confirmbrokeinstock'), this.$t('common.tips'), {
        type: 'warning'
      }).then(() => {
        instockApi
          .breakInstock({ stockInId: row.id, version: row.version })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('warehouse.brokesuccess')
              });
              this.search();
            } else {
              this.$message.info(res.msg);
            }
          });
      });
    },
    // 手动建单入库
    add() {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'createInstock'
      });
    },
    resetForm() {
      for (const key in this.queryForm) {
        key === 'status' ? '' : (this.queryForm[key] = '');
      }
      this.timeArr = [];
      this.timeList = [];
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.instockmanager-container {
  padding: 15px;
  .risk-status-tab {
    margin-bottom: 20px;
    margin-left: 68px;
    .el-radio-button__inner {
      padding: 12px 30px;
      font-size: 14px;
    }
  }
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    .new-btn {
      float: right;
      font-size: 14px;
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .instockmanager-table {
    padding: 15px;
    background-color: #fff;
    .tac {
      text-align: center;
    }
    .pop-btn.el-button {
      width: 100%;
      margin-right: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
