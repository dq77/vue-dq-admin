<template>
  <div class="category-container goods-container pageContent">
    <div class="query-block search-block">
      <el-row :gutter="20">
        <el-col :span="16">
          <span>{{ $t('good.categoryName') }} </span>
          <el-input v-model="queryForm.keyword" clearable class="input-160 mr-15"/>
          <el-button icon="el-icon-search" type="primary" @click="search()">{{ $t('common.find') }}</el-button>
        </el-col>
        <el-col :span="8">
          <div class="right-block">
            <el-button icon="el-icon-plus" type="primary" @click="addNewCategory()">{{ $t('good.addCategory') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div ref="reftable" class="goods-content">
      <el-table :data="tableData" :indent="44" row-key="id" border default-expand-all>
        <el-table-column :label="$t('good.categoryName')" prop="name">
          <template slot-scope="scope">
            <span :class="{indentleft: !scope.row.children}">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="450" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="addNewCategory(scope.row)">{{ $t('good.addCategory') }}</el-button>
            <el-button type="primary" plain @click="editNewCategory(scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button v-if="scope.row.status === 0" type="success" plain @click="dredgeModule(scope.row)">上线</el-button>
            <el-button v-else type="warning" plain @click="closeModule(scope.row)">下线</el-button>
            <el-button type="danger" plain @click="deleteModule(scope.row)">{{ $t('common.delete') }}</el-button>
            <el-button type="info" plain @click="viewLog(scope.row)">查看日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialgoVisible" :title="dialogTitle" width="500px" center @close="handCancel">
      <el-form ref="fomData" :model="formData" :rules="formRule" status-icon label-width="140px" >
        <el-form-item label="路径">
          <span>{{ formData.path }}</span>
        </el-form-item>
        <el-form-item :label="$t('good.categoryName')" prop="name">
          <el-input v-model="formData.name" :placeholder="$t('good.iptCategoryName')" class="input-200"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" plain @click="handCancel()">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handOk('fomData')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="logDialog" :title="$t('good.showlog')" center @close="cancelLog">
      <operate-log :data-source="logData"/>
    </el-dialog>
    <pagination v-show="total > 0" :total="total" :page.sync="queryForm.page" :limit.sync="queryForm.pageSize" @pagination="fetchmoduleList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import goodsApi from '@/api/goods.js'
import operateLog from '../partnerManager/enterprise/componets/operatlog'
export default {
  components: {
    Pagination,
    operateLog
  },
  data() {
    return {
      dialgoVisible: false, // 新增模块弹窗
      logDialog: false, // 日志弹窗
      logData: [], // 日志数据
      queryForm: {
        keyword: '',
        page: 1,
        pageSize: 10,
        parentId: '0'
      },
      total: 0,
      formData: {
        path: '',
        name: '',
        id: '',
        version: '',
        parentId: ''
      },
      dialogTitle: this.$t('good.addCategory'),
      formRule: {
        name: [
          { required: true, message: this.$t('good.iptCategoryName'), trigger: 'blur' }
        ]
      },
      tableData: [],
      parentList: []
    }
  },
  watch: {
    queryForm: {
      deep: true,
      handler() {
        this.queryForm.keyword = this.queryForm.keyword.replace(/\s/g, '');
      }
    }
  },
  created() {
  },
  mounted() {
    this.fetchmoduleList()
  },
  methods: {
    // 查看日志
    viewLog(row) {
      this.logDialog = true;
      goodsApi.categoryLog(row.id).then(res => {
        if (res.code === 200) {
          this.logData = res.data.map(item => {
            return {
              gmtCreate: item.time,
              log: item.operation,
              username: item.operatorName
            }
          })
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    // 获取模块列表
    fetchmoduleList() {
      goodsApi.getCategories({ ...this.queryForm }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || []
          this.allData = res.data.list || []
          this.total = res.data.totalRecords
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 数据筛选
    fromartExpand(key, arr) {
      return arr.filter(item => {
        if (item.name.includes(key)) {
          return true
        } else if (item.children) {
          item.children = this.fromartExpand(key, item.children)
          if (item.children.length > 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    },
    search() {
      this.queryForm.page = 1
      this.fetchmoduleList()
    },

    // 新增模块
    addNewCategory(row) {
      if (row) {
        this.initParh(row)
        this.dialogTitle = '新增' + (this.parentList.length - 0 + 1) + '级类目'
        this.formData.parentId = row.id
      } else {
        this.dialogTitle = '新增类目'
        this.parentList = []
      }
      this.dialgoVisible = true
    },
    // 编辑模块
    editNewCategory(row) {
      this.initParh(row)
      this.formData.name = row.name
      this.formData.id = row.id
      this.formData.version = row.version
      this.dialogTitle = '编辑类目'
      this.dialgoVisible = true
    },
    // 非一级菜单新增/编辑时初始化其parent
    initParh(row) {
      this.parentList = []
      this.getParent(row)
      this.parentList.push(row)
      this.parentList.map((item, index) => {
        this.formData.path += (index === 0 ? '' : ' > ') + item.name
      })
    },

    // 删除模块
    deleteModule(val) {
      this.$confirm(this.$t('setCenter.confirmdelmodule'), this.$t('common.tips'), {
        type: 'warning'
      }).then(_ => {
        const params = {
          id: val.id
        }
        goodsApi.deleteCategories({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'))
            this.fetchmoduleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },

    // 上线此模块
    dredgeModule(row) {
      this.$confirm(this.$t('setCenter.confirmopenmodule'), this.$t('common.tips'), {
        type: 'warning'
      }).then(() => {
        goodsApi.enablecategory({ id: row.id, version: row.version }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('setCenter.opensuccess'))
            this.fetchmoduleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {});
    },

    // 下线此模块
    closeModule(row) {
      this.$confirm(this.$t('setCenter.confirmclosemodule'), this.$t('common.tips'), {
        type: 'warning'
      }).then(() => {
        goodsApi.disablecategory({ id: row.id, version: row.version }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('setCenter.closesuccess'))
            this.fetchmoduleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {});
    },
    // 获取弗雷列表
    getParent(item) {
      if (item.parentId !== '0') {
        const res = this.findItem(this.tableData, item.parentId)
        this.parentList.unshift(res)
        if (res.parentId !== '0') {
          this.getParent(res)
        }
      }
    },
    // 根据ID查找对象
    findItem(row, id) {
      for (const item of row) {
        if (item.id === id) {
          return item
        } else if (item.children) {
          const res = this.findItem(item.children, id)
          if (res) {
            return res
          }
        }
      }
    },

    // 新增编辑确认
    handOk() {
      if (this.formData.id) {
        goodsApi.editCategories(this.formData).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.editSuccess'))
            this.handCancel()
            this.fetchmoduleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        if (!this.formData.parentId) {
          this.formData.parentId = null
        }
        goodsApi.addCategories(this.formData).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.addSuccess'))
            this.handCancel()
            this.fetchmoduleList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },

    handCancel() {
      this.dialgoVisible = false
      for (const key in this.formData) {
        this.formData[key] = ''
      }
      this.$refs.fomData.clearValidate();
    },
    cancelLog() {
      this.logDialog = false;
    }
  }
}
</script>

<style lang="scss">
  .category-container {
    padding: 15px;
    font-size: 14px;
    .search-block {
      padding: 16px 20px;
    }
    .indentleft{
      margin-left: 0px;
    }
    .goods-content {
      padding: 20px;
      background-color: #fff;
      display: flex;
      flex: 1;
    }
  }
</style>
