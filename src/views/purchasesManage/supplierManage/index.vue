<template>
  <div class="supplierManage-container">
    <div class="search-container">
      <el-form
        :inline="true"
        label-width="150px"
      >
        <el-form-item :label="$t('purchasesManage.supplierId')">
          <el-input
            v-model="queryForm.supplierId"
            :placeholder="$t('purchasesManage.iptsupplierId')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('financial.suppliername')">
          <el-input
            v-model="queryForm.name"
            :placeholder="$t('financial.iptsuppliername')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('purchasesManage.suppliertype')">
          <el-select
            v-model="queryForm.supplierMode"
            :placeholder="$t('purchasesManage.slctsuppliertype')"
            clearable
          >
            <el-option
              :label="$t('common.all')"
              value
            />
            <el-option
              :label="$t('good.supply')"
              value="SUPPLY"
            />
            <el-option
              :label="$t('good.deliver')"
              value="DELIVER"
            />
            <el-option
              :label="$t('good.selling')"
              value="SELLING"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('purchasesManage.cooperatstatus')">
          <el-select
            v-model="queryForm.status"
            :placeholder="$t('purchasesManage.iptcooperatstatus')"
            clearable
          >
            <el-option
              :label="$t('common.all')"
              value
            />
            <el-option
              :label="$t('purchasesManage.underway')"
              value="UNDERWAY"
            />
            <el-option
              :label="$t('purchasesManage.terminate')"
              value="TERMINATE"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button
          type="primary"
          @click="search()"
        >{{ $t('common.find') }}</el-button>
        <el-button
          type="primary"
          @click="add()"
        >{{ $t('common.new') }}</el-button>
      </div>
    </div>
    <div class="supplierManage_table">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          :label="$t('purchasesManage.supplierId')"
          prop="id"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('financial.suppliername')"
          prop="name"
          align="center"
        />
        <el-table-column
          :label="$t('purchasesManage.suppliertype')"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
            >
              <el-button
                slot="reference"
                type="text"
              >
                <span
                  v-for="item in (scope.row.cooperationModes && scope.row.cooperationModes.length>0 &&scope.row.cooperationModes[0].strategies)"
                  :key="item.id"
                  style="margin:0 5px"
                >{{ item.supplierMode | supplierFilter }}</span>
              </el-button>
              <el-table
                :data="(scope.row.cooperationModes && scope.row.cooperationModes.length>0 && scope.row.cooperationModes[0].strategies || [])"
                border
                style="width: 100%;"
              >
                <el-table-column
                  :label="$t('purchasesManage.suppliertype')"
                  width="150px"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.supplierMode | supplierFilter }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('purchasesManage.settleperiod')"
                  width="150px"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.baseTimeStrategyDesc }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('purchasesManage.contacts')"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.contacts? scope.row.contacts.name: '' }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('common.creatTime')"
          prop="gmtCreated"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('common.status')"
          prop="cooperationStatus"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.modeStatus !== null"
              :type="scope.row.modeStatus.SUPPLIER === 'UNDERWAY' ? 'success' : 'danger'"
            >{{ scope.row.modeStatus.SUPPLIER === 'UNDERWAY' ? $t('purchasesManage.underway'): $t('purchasesManage.terminate') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.actions')"
          min-width="150px"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              @click="view(scope.row)"
            >{{ $t('common.see') }}</el-button>
            <el-button
              type="primary"
              plain
              @click="edit(scope.row)"
            >{{ $t('common.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import {
  rqEnterprisesList // 查询列表
} from '@/api/purchase/index';
export default {
  components: {
    pagination
  },
  data() {
    return {
      queryForm: {
        supplierId: '',
        name: '',
        status: '',
        supplierMode: ''
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      loading: false,
      tableData: []
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    // 分页变化
    paginationChange(val) {
      this.getList();
    },

    // 获取列表信息
    getList() {
      this.loading = true;
      const params = {
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...this.queryForm
      };
      rqEnterprisesList({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords || 0;
          this.loading = false;
        } else {
          this.$message.info(res.msg);
        }
      });
    },

    // 查询条件
    search() {
      this.getList();
    },

    // 新增
    add() {
      this.$router.push({
        name: 'supplierEdit'
      });
    },

    // 查看详情
    view(value) {
      this.$router.push(`supplierDetail/${value.id}`);
    },

    // 编辑
    edit(value) {
      this.$router.push({
        name: 'supplierEdit',
        query: { id: value.id }
      });
    },
    // 入库单详情页
    goDetail(value) {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.supplierManage-container {
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
    border: 1px solid #ebeef5;
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .supplierManage_table {
    padding: 15px;
    background-color: #fff;
    border: 1px solid #ebeef5;
  }
}
</style>
