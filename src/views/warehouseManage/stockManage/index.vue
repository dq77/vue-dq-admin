<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-07-29 14:16:31
 * @Description: file content
 -->
<template>
  <div class="stockmanager-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <el-form-item :label="$t('warehouse.stockcode')">
          <el-input v-model="queryForm.code" clearable />
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockaddress')">
          <el-select v-model="queryForm.placeId" placeholder="请输入城市" clearable filterable>
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockname')">
          <el-input v-model="queryForm.name" clearable />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="queryForm.enabled" clearable>
            <el-option :label="$t('common.all')" value />
            <el-option :value="true" :label="$t('warehouse.inuse')" />
            <el-option :value="false" :label="$t('warehouse.outuse')" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('warehouse.manager')">
          <el-input v-model="queryForm.managerName" clearable />
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">{{ $t('common.find') }}</el-button>
        <el-button type="primary" @click="add()">{{ $t('common.new') }}</el-button>
      </div>
    </div>
    <div class="stockmanager-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column :label="$t('warehouse.stockcode')" prop="code" />
        <el-table-column :label="$t('warehouse.stockname')" prop="name" />
        <el-table-column :label="$t('warehouse.stockaddress')" width="400%">
          <template slot-scope="scope">
            <span v-if="scope.row.address && scope.row.address.districts && scope.row.address.districts[2]">
              {{ scope.row.address.indexAndDetail[1] }} {{ scope.row.address.indexAndDetail[2] }} {{ scope.row.address.districts[2].name }} {{ scope.row.address.districts[1].name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" prop="status" width="120px">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.enabled !== null"
              :type="scope.row.enabled === true ? 'success' : 'info'"
            >{{ scope.row.enabled ? $t('warehouse.inuse'):$t('warehouse.outuse') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('warehouse.manager')" prop="managers">
          <template slot-scope="scope">
            <span v-for="item in scope.row.managers" :key="item.id">{{ ` ${item.name}` }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" min-width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="edit(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button type="primary" plain icon="el-icon-view" @click="view(scope.row)">{{ $t('common.see') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>
    <add-dialog :show="addDialog" :data-source="commonData" @handClose="closeDialog" @handleOk="submit"/>
    <detail :show="viewDialog" :data-source="commonData" @handClose="closeDetail" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import locationList from '@/assets/location/location';
import addDialog from './components/add';
import detail from './components/detail';
import warehouseApi from '@/api/warehouse/warehouse';
export default {
  components: {
    pagination,
    addDialog,
    detail
  },
  data() {
    return {
      queryForm: {
        code: '',
        placeId: '',
        name: '',
        enabled: '',
        managerName: ''
      },
      searchForm: {
        code: '',
        placeId: '',
        name: '',
        enabled: '',
        managerName: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [{}],
      commonData: {}, // 新增编辑数据
      cityList: locationList,
      addDialog: false, // 新增编辑弹窗
      viewDialog: false // 详情弹窗
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表信息
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.searchForm
      };
      warehouseApi.getStockList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 查询条件
    search() {
      this.searchForm = {
        ...this.queryForm
      };
      console.log(this.searchForm);
      this.listQuery.page = 1;
      this.getList();
    },
    // 查看详情
    view(row) {
      this.viewDialog = true;
      this.commonData = {
        ...row
      };
    },

    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
    },

    // 新增
    add() {
      this.addDialog = true;
      this.commonData = {};
    },

    // 编辑
    edit(row) {
      this.addDialog = true;
      this.commonData = {
        ...row
      };
    },

    // 关闭弹窗
    closeDialog(val) {
      this.addDialog = val;
    },
    // 新增信息提交
    submit(val) {
      if (val.id) {
        this.updateWarehouse(val);
      } else {
        this.addWarehouse(val);
      }
    },
    // 编辑
    updateWarehouse(data) {
      warehouseApi.updateWarehouse(data).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.addDialog = false;
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 新增
    addWarehouse(data) {
      warehouseApi.addWarehouse(data).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.addSuccess'));
          this.addDialog = false;
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.stockmanager-container {
  padding: 15px;
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .stockmanager-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
