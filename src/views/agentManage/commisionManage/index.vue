<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-25 17:18:07
 * @Description: file content
 -->
<template>
  <div class="agentlist-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <!-- <el-form-item label="姓名：">
          <el-input v-model="queryForm.name" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="queryForm.contactNumber" clearable placeholder="请输入手机号" />
        </el-form-item> -->
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="agentlist-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="项目名称" prop="name"/>
        <el-table-column label="适用用户" prop="userRole">
          <template slot-scope="scope">
            <span v-if="scope.row.userRole === 1">经纪人</span>
          </template>
        </el-table-column>
        <el-table-column label="返佣比例" prop="levelRate">
          <template slot-scope="scope">
            {{ scope.row.levelRates[0] * 100 }}%
          </template>
        </el-table-column>
        <el-table-column label="返佣规则" prop="strategyType">
          <template slot-scope="scope">
            <span v-if="scope.row.strategyType === 0">经纪人返佣</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="add(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 2" type="info" plain icon="el-icon-sort-down" @click="downTemp(scope.row)">禁用</el-button>
            <el-button v-else type="success" plain icon="el-icon-sort-up" @click="upTemp(scope.row)">启用</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="delCommission(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
    <add :show="viewDialog" :data-source="commonData" @handClose="closeDetail" @handleOk="submit"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import add from './components/add';
import {
  commissionsDisable, // 禁用策略
  getCommissionList, // 分页查询
  creatCommissions, // 创建策略
  editCommissions, // 编辑策略
  delCommissions, // 删除策略
  commissionsEnable // 启用策略
} from '@/api/broker/index';
export default {
  components: {
    pagination,
    add
  },
  data() {
    return {
      queryForm: {
        contactNumber: '', // 手机号
        name: '' // 姓名
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      commonData: {}, // 详情数据
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
        size: this.listQuery.pageSize,
        ...this.queryForm
      };
      getCommissionList(data).then(res => {
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
      this.listQuery.page = 1;
      this.getList();
    },

    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
    },

    // 新增
    add(row = {}) {
      this.viewDialog = true;
      this.commonData = {
        ...row
      };
    },
    submit(val) {
      val.levelRate = { '0': val.levelRate }
      val.configId = val.id
      if (val.id) {
        editCommissions(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'));
            this.viewDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        creatCommissions(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.addSuccess'));
            this.viewDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 启用
    upTemp(row) {
      commissionsEnable(row).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 禁用
    downTemp(row) {
      commissionsDisable(row).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 删除
    delCommission(row) {
      this.$confirm('确认删除?', this.$t('common.tips'), { type: 'warning' }).then(() => {
        delCommissions(row).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'));
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
.agentlist-container {
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
  .agentlist-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
