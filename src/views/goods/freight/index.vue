<!--
 * @Author: 刁琪
 * @Date: 2020-07-29 15:16:45
 * @LastEditors: わからないよう
-->
<template>
  <div class="freight-and-page">
    <div class="search-container">
      <el-radio-group v-model="status" class="risk-status-tab" @change="selectStatus">
        <el-radio-button label="freight">运费</el-radio-button>
        <el-radio-button label="taxfei">税费</el-radio-button>
      </el-radio-group>
      <div class="search-btn">
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>

    <div class="list-table">
      <el-table v-loading="loading" v-if="status === 'freight'" :data="tableData" border style="width: 100%">
        <el-table-column label="城市" prop="city">
          <template slot-scope="scope">
            <span v-if="scope.row.templateRule && scope.row.templateRule.origin">
              {{ scope.row.templateRule.origin.districts[2].name }} {{ scope.row.templateRule.origin.districts[1].name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="基础运费" prop="baseCardinal">
          <template slot-scope="scope">
            <span v-if="scope.row.templateRule && scope.row.templateRule.origin">
              {{ scope.row.templateRule.baseCardinal }} 英里 以内 {{ scope.row.templateRule.baseCharge }}$
            </span>
          </template>
        </el-table-column>
        <el-table-column label="增值运费" prop="increaseCharge">
          <template slot-scope="scope">
            <span v-if="scope.row.templateRule && scope.row.templateRule.origin">
              每增加 {{ scope.row.templateRule.increaseStep }}英里 {{ scope.row.templateRule.increaseCharge }}$
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 2 ? 'success' : 'primary'">{{ scope.row.status === 2 ? '使用中' : '未使用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="add(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button v-if="scope.row.status === 2" type="info" plain icon="el-icon-sort-down" @click="downTemp(scope.row)">禁用</el-button>
            <el-button v-else type="success" plain icon="el-icon-sort-up" @click="upTemp(scope.row)">启用</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="delTemp(scope.row)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-loading="loading" v-else :data="tableData" border style="width: 100%">
        <el-table-column label="城市" prop="city">
          <template slot-scope="scope">
            <span v-if="scope.row.districts && scope.row.districts[2]">
              {{ scope.row.districts[2].name }} {{ scope.row.districts[1].name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="税种" prop="name">
          <template slot-scope="scope">
            <span v-if="scope.row.rates">消费税</span>
          </template>
        </el-table-column>
        <el-table-column label="税率" prop="name">
          <template slot-scope="scope">
            <span v-if="scope.row.rates">{{ scope.row.rates[0]*100 + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 2 ? 'success' : 'primary'">{{ scope.row.status === 2 ? '使用中' : '未使用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="add(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button v-if="scope.row.status === 2" type="info" plain icon="el-icon-sort-down" @click="downTemp(scope.row)">禁用</el-button>
            <el-button v-else type="success" plain icon="el-icon-sort-up" @click="upTemp(scope.row)">启用</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="delTemp(scope.row)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <add-freight-dialog :show="addFreightDialog" :data-source="commonData" @handClose="closeDialog" @handleOk="submit"/>
      <add-tax-dialog :show="addTaxDialog" :data-source="commonData" @handClose="closeDialog" @handleOk="submit"/>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
import pagination from '@/components/Pagination/index';
import addFreightDialog from './components/addFreight';
import addTaxDialog from './components/addTax';
export default {
  components: {
    pagination,
    addFreightDialog,
    addTaxDialog
  },
  data() {
    return {
      status: 'freight',
      loading: true,
      queryForm: {
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
      searchForm: {
        code: '',
        placeId: '',
        name: '',
        enabled: '',
        managerName: ''
      },
      commonData: {}, // 新增编辑数据
      tableData: [], // 列表数据
      addFreightDialog: false, // 添加运费弹窗
      addTaxDialog: false // 添加税费弹窗
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.rule = val.status === 20 ? this.isShow : this.isNotShow;
      },
      deep: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.searchForm
      };
      this.loading = true
      if (this.status === 'freight') {
        goodsApi.getShippingTemplateList(data).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.tableData = res.data.list || [];
            this.total = res.data.totalRecords;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        goodsApi.getTaxTemplateList(data).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.tableData = res.data.list || [];
            this.total = res.data.totalRecords;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    search() {
      this.searchForm = {
        ...this.queryForm
      };
      this.listQuery.page = 1;
      this.getList();
    },
    // 新增、编辑运费税费弹窗
    add(row = {}) {
      if (this.status === 'freight') {
        this.addFreightDialog = true;
      } else {
        this.addTaxDialog = true;
      }
      this.commonData = row;
    },
    // 关闭运费税费弹窗
    closeDialog(val) {
      this.addFreightDialog = val;
      this.addTaxDialog = val;
    },
    // 弹窗信息保存提交
    submit(val) {
      if (this.status === 'freight') {
        this.addShipping(val);
      } else {
        this.addTax(val);
      }
    },
    addShipping(val) {
      val.districts = val.address.districts
      if (val.id) {
        goodsApi.editShippingTemplate(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'));
            this.addFreightDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        goodsApi.addShippingTemplate(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.addSuccess'));
            this.addFreightDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    addTax(val) {
      val.rates = { [val.description]: ((val.rate - 0) / 100).toFixed(2) }
      val.districts = val.address.districts
      if (val.id) {
        goodsApi.editTaxingTemplate(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'));
            this.addTaxDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        goodsApi.addTaxingTemplate(val).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.addSuccess'));
            this.addTaxDialog = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 上架
    upTemp(row) {
      let api = {}
      if (this.status === 'freight') {
        api = goodsApi.enableFreightTemplate
      } else {
        api = goodsApi.enableTaxingTemplate
      }
      api(row).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 下架
    downTemp(row) {
      let api = {}
      if (this.status === 'freight') {
        api = goodsApi.disableFreightTemplate
      } else {
        api = goodsApi.disableTaxingTemplate
      }
      api(row).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('common.editSuccess'));
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除模板
    delTemp(row) {
      let api = {}
      if (this.status === 'freight') {
        api = goodsApi.delFreightTemplate
      } else {
        api = goodsApi.delTaxingTemplate
      }
      this.$confirm('确认删除?', this.$t('common.tips'), { type: 'warning' }).then(() => {
        api(row).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'));
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 切换费用tab状态
    selectStatus() {
      this.resetForm();
      this.search();
    },
    resetForm() {
      for (const key in this.queryForm) {
        this.queryForm[key] = ''
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.freight-and-page{
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
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .list-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
