<!--
 * @Author: 刁琪
 * @Date: 2019-01-10 19:44:51
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 10:14:38
 -->
<template>
  <div class="pageContent">
    <div class="moduleMain">
      <div class="topOpertion">
        <el-button type="primary" icon="el-icon-plus" @click="addModule()">{{ $t('setCenter.addmodule') }}</el-button>
      </div>
      <div ref="reftable" style="flex:1;">
        <!-- <tree-table v-loading="loading" :data="data" :columns="columns" :max-height="maxheight" border @expandedArr="expandedArr">
          <el-table-column :label="$t('common.actions')" align="center">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.parent" type="primary" plain icon="el-icon-circle-check" @click="addModule(scope.row,scope, scope)">{{ $t('setCenter.addmodule') }}</el-button>
              <el-button type="danger" plain icon="el-icon-circle-close" @click.native.prevent="deleteModule(scope.row)">{{ $t('setCenter.delmodule') }}</el-button>
              <el-button v-if="scope.row.status !==1" type="primary" plain icon="el-icon-upload2" @click.native.prevent="dredgeModule(scope.row)">{{ $t('setCenter.upmodule') }}</el-button>
              <el-button v-else type="danger" plain icon="el-icon-download" @click.native.prevent="closeModule(scope.row)">{{ $t('setCenter.downmodule') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===1" type="success">{{ $t('setCenter.isonmodule') }}</el-tag>
              <el-tag v-else type="danger">{{ $t('setCenter.isdownmodule') }}</el-tag>
            </template>
          </el-table-column>
        </tree-table>-->
        <el-table :data="data" :indent="44" row-key="id" border>
          <el-table-column :label="this.$t('setCenter.funcmodules')" prop="authority">
            <template slot-scope="scope">
              <span :class="{indentleft: (scope.row.children && scope.row.children.length === 0)}">{{ scope.row.authority }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.actions')" width="450">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.parent"
                type="primary"
                plain
                icon="el-icon-circle-check"
                @click="addModule(scope.row,scope, scope)"
              >{{ $t('setCenter.addmodule') }}</el-button>
              <span v-else class="block-item" />
              <el-button type="danger" plain icon="el-icon-circle-close" @click.native.prevent="deleteModule(scope.row)">{{ $t('setCenter.delmodule') }}</el-button>
              <el-button
                v-if="scope.row.status !==1"
                type="primary"
                plain
                icon="el-icon-upload2"
                @click.native.prevent="dredgeModule(scope.row)"
              >{{ $t('setCenter.upmodule') }}</el-button>
              <el-button v-else type="danger" plain icon="el-icon-download" @click.native.prevent="closeModule(scope.row)">{{ $t('setCenter.downmodule') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="100" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===1" type="success">{{ $t('setCenter.isonmodule') }}</el-tag>
              <el-tag v-else type="danger">{{ $t('setCenter.isdownmodule') }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹窗 -->
    <add-module :show="visible" :parent-obj="checkMduleParentObj" @handOk="handOk" @handCancel="handCancel" />
  </div>
</template>
<script>
import treeTable from '@/components/TreeTable';
import addModule from './modal/addmodule'; // 新增模块窗口
import {
  authorityList, // 权限列表
  authorityDelete, // 权限删除
  authoritydisable, // 启用权限
  authorityable // 权限关闭
} from '@/api/setCenter';

export default {
  components: {
    treeTable,
    addModule
  },
  data() {
    return {
      visible: false, // 新增模块弹窗
      // comfirmvisible: false,
      loading: false,
      maxheight: '500px',
      columns: [
        {
          text: this.$t('setCenter.funcmodules'),
          value: 'authority',
          width: 200
        }
      ],
      data: [
        // {
        //   authority: '22',
        //   id: 1,
        //   children: [{
        //     authority: '33',
        //     id: 2
        //   }]
        // }, {
        //   authority: '44',
        //   id: 3,
        //   _expanded: true,
        //   children: [{
        //     authority: '33',
        //     id: 4
        //   }]
        // }
      ],
      checkMduleParentObj: {}, // 父级模块的row
      expanded: [] // 树形表格已展开的节点
    };
  },
  created() {},
  mounted() {
    this.fetchmoduleList();
    this.setTableHeght();
  },
  methods: {
    // 设置表格高度
    setTableHeght() {
      this.$nextTick(() => {
        this.maxheight = this.$refs.reftable.offsetHeight;
      });
    },

    // 获取模块列表
    fetchmoduleList() {
      const params = {
        page: 1,
        pageSize: 1000
      };
      authorityList({ ...params }).then(res => {
        if (res.code === 200) {
          this.data = this.fromartExpand(res.data.list) || [];
          this.loading = false;
        } else {
          this.$message.error(res.msg);
          this.loading = false;
        }
      });
    },

    // 数据格式化
    fromartExpand(arr) {
      const newArr = [];
      arr.map(item => {
        this.expanded.map(one => {
          if (one === item.id && !item.parent) {
            item._expanded = true;
          }
        });
        if (item.parent === null) {
          newArr.push(item);
        }
        // newArr.push(item)
      });
      return newArr;
    },

    // 新增模块
    addModule(row, scope) {
      console.log('scope', scope);
      if (row) {
        this.checkMduleParentObj = row; // 父级模块的id
      } else {
        this.checkMduleParentObj = {};
      }
      this.visible = true;
    },

    // 删除模块
    deleteModule(val) {
      this.$confirm(
        this.$t('setCenter.confirmdelmodule'),
        this.$t('common.tips'),
        {
          type: 'warning'
        }
      ).then(_ => {
        const params = {
          id: val.id
        };
        authorityDelete({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success(this.$t('common.deleteSuccess'));
            this.fetchmoduleList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 上线此模块
    dredgeModule(row) {
      this.$confirm(
        this.$t('setCenter.confirmopenmodule'),
        this.$t('common.tips'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          authoritydisable({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('setCenter.opensuccess'));
              this.fetchmoduleList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 下线此模块
    closeModule(row) {
      this.$confirm(
        this.$t('setCenter.confirmclosemodule'),
        this.$t('common.tips'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          authorityable({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success(this.$t('setCenter.closesuccess'));
              this.fetchmoduleList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },

    // 树形表格的回调
    expandedArr(arr) {
      console.log('arr', arr);
      this.expanded = arr;
    },

    handOk() {
      this.visible = false;
      this.fetchmoduleList();
    },

    handCancel() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.moduleMain {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #fff;
  border: 1px solid #dfe4ea;
  padding: 16px;
  .topOpertion {
    margin-bottom: 16px;
  }
  .indentleft {
    margin-left: 23px;
  }
  .block-item {
    display: inline-block;
    width: 107px;
    height: 10px;
  }
}
</style>

