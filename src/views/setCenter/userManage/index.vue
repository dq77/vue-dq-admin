<!--
 * @Author: 刁琪
 * @Date: 2019-01-10 19:45:07
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-07-30 17:43:57
 -->
<template>
  <div class="pageContent content">
    <div class="wrap">
      <div class="header-opertion">
        <el-input v-model="keyWords" :placeholder="$t('setCenter.iptkeywdsearch')" class="input-220">
          <i slot="prefix" class="el-input__icon el-icon-search" />
        </el-input>
        <el-button type="primary" icon="el-icon-search" class="marginL-16" @click="search">{{ $t('common.find') }}</el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          class="marginL-16"
          @click="operationalEvents"
        >{{ $t('setCenter.searchactionevent') }}</el-button>
        <el-button type="primary" class="marginL-16 addBtn" @click="addUser">
          <svg-icon icon-class="add" />{{ $t('setCenter.adduser') }}
        </el-button>
      </div>
      <div class="table-content">
        <div ref="reftable" class="tab-wrap">
          <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
            <el-table-column :label="$t('setCenter.accountname')" prop="username" align="center" />
            <el-table-column :label="$t('setCenter.name')" prop="realname" align="center" />
            <el-table-column :label="$t('setCenter.belongrole')" prop="role" align="center">
              <template slot-scope="scope">
                <ul>
                  <li v-for="item in scope.row.type" :key="item.id">
                    <el-tag class="table-tag">{{ item.role }}</el-tag>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column :label="$t('setCenter.phonenum')" prop="mobile" align="center" />
            <el-table-column :label="$t('common.status')" prop="status" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status=== 1 ? 'success' : 'danger'"
                >{{ scope.row.status === 1 ? $t('good.usetemplate') : $t('good.unusetemplate') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('setCenter.addtime')" prop="gmtCreate" align="center" show-overflow-tooltip />
            <el-table-column :label="$t('setCenter.logintime')" prop="lastTime" align="center" show-overflow-tooltip />
            <el-table-column :label="$t('common.actions')" prop="opertion" align="center" width="280">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status === 1"
                  type="warning"
                  plain
                  icon="el-icon-close"
                  @click="disable(scope.row.id)"
                >{{ $t('good.unusetemplate') }}</el-button>
                <el-button
                  v-else
                  type="primary"
                  plain
                  icon="el-icon-check"
                  @click="able(scope.row.id)"
                >{{ $t('good.usetemplate') }}</el-button>
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  @click="deleteUser(scope.row.id)"
                >{{ $t('common.delete') }}</el-button>
                <el-button type="info" plain icon="el-icon-edit" @click="editUser(scope.row.id)">{{ $t('common.edit') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.pageSize"
          @pagination="paginationChange"
        />
      </div>
    </div>
    <!-- 弹窗 -->
    <AddModal
      :show="visible"
      :modal="modal"
      :title="title"
      :propid="editId"
      @handOk="handOk"
      @handCancel="handCancel"
    />
    <Operational
      :show="opertionvisible"
      @handOk="() => opertionvisible=false"
      @handCancel="() => opertionvisible=false"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import AddModal from './modal/addAndEdit'; // 添加用户
import Operational from './modal/operationalEvents'; // 查询操作日志
import {
  adminlist, // 用户列表
  ableUser, // 启用
  deleteUser, // 删除
  disableUser // 禁用
} from '@/api/setCenter';
export default {
  components: {
    Pagination,
    AddModal,
    Operational
  },
  data() {
    return {
      visible: false, // 弹窗显示隐藏
      opertionvisible: false, // 操作日志
      keyWords: '',
      total: 0, // 总数量
      loading: true,
      maxheight: 500,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      modal: false,
      editId: '',
      title: ''
    };
  },
  created() {},
  mounted() {
    this.setTableHeght();
    this.fetchTableData();
  },
  methods: {
    // 设置表格高度
    setTableHeght() {
      this.$nextTick(() => {
        this.maxheight = this.$refs.reftable.offsetHeight;
      });
    },

    // 表格初始化
    fetchTableData() {
      const params = {
        keyWords: this.keyWords,
        ...this.listQuery
      };
      adminlist({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.totalCount || 0;
          this.loading = false;
        } else {
          this.$message.error(res.msg);
          this.loading = false;
        }
      });
    },

    // 添加用户
    addUser() {
      this.modal = !this.modal;
      this.title = this.$t('setCenter.adduser');
      this.visible = true;
    },

    // 编辑用户
    editUser(id) {
      this.visible = true;
      this.modal = !this.modal;
      this.title = this.$t('setCenter.edituser');
      this.editId = id;
    },

    handOk() {
      this.visible = false;
      this.fetchTableData();
    },

    handCancel() {
      this.visible = false;
    },

    // 禁用
    disable(id) {
      this.$confirm(this.$t('setCenter.confirmbanuser'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          const params = {
            id
          };
          disableUser({ ...params }).then(res => {
            if (res.code === 200) {
              this.fetchTableData();
              this.$message({
                type: 'success',
                message: this.$t('setCenter.bansuccess')
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 启用
    able(id) {
      this.$confirm(this.$t('setCenter.confirmpickuser'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          const params = {
            id
          };
          ableUser({ ...params }).then(res => {
            if (res.code === 200) {
              this.fetchTableData();
              this.$message({
                type: 'success',
                message: this.$t('setCenter.picksuccess')
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 删除用户
    deleteUser(id) {
      this.$confirm(this.$t('setCenter.confirmdeluser'), this.$t('common.tips'), {
        type: 'warning'
      })
        .then(() => {
          const params = {
            id
          };
          deleteUser({ ...params }).then(res => {
            if (res.code === 200) {
              this.fetchTableData();
              this.$message({
                type: 'success',
                message: this.$t('common.deleteSuccess')
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 搜索
    search() {
      this.fetchTableData();
    },

    // 分页变化
    paginationChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.pageSize = val.limit;
      this.fetchTableData();
    },

    // 查询操作日志
    operationalEvents() {
      this.opertionvisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  .wrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #fff;
    padding: 16px 16px 0 16px;
    border: 1px solid #dfe4ea;
    .header-opertion {
      margin-bottom: 16px;
      // .addBtn {
      //   position: absolute;
      //   margin-left: 80%;
      // }
    }
  }
  .table-content {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    flex: 1;
    background: #fff;
    .tab-wrap {
      flex: 1;
      overflow: auto;
    }
  }
}
</style>

