<!--
 * @Author: 刁琪
 * @Date: 2019-01-12 15:52:00
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 15:57:29
 -->
<template>
  <div style="flex:1; overflow:auto;">
    <!-- <tree-table v-loading="loading" ref="treetable" :data="data" :columns="columns" border @expandedArr="expandedArr">
      <el-table-column :label="$t('setCenter.modulestatus')" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOpen===1" type="success">{{ $t('setCenter.isopen') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('setCenter.isclose') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.actions')" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isOpen" type="primary" plain icon="el-icon-circle-check" @click="dredgeModule(scope.row)">{{ $t('setCenter.open') }}</el-button>
          <el-button v-else type="danger" plain icon="el-icon-circle-close" @click="closeModule(scope.row)">{{ $t('common.close') }}</el-button>
        </template>
      </el-table-column>
    </tree-table> -->
    <el-table :data="data" :indent="44" row-key="id" border>
      <el-table-column :label="this.$t('setCenter.selectedmodules')" prop="authority">
        <template slot-scope="scope">
          <span :class="{indentleft: (scope.row.children && scope.row.children.length === 0)}">{{ scope.row.authority }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('setCenter.modulestatus')" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOpen===1" type="success">{{ $t('setCenter.isopen') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('setCenter.isclose') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.isOpen" type="primary" plain icon="el-icon-circle-check" @click="dredgeModule(scope.row)">{{ $t('setCenter.open') }}</el-button>
          <el-button v-else type="danger" plain icon="el-icon-circle-close" @click="closeModule(scope.row)">{{ $t('common.close') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import treeTable from '@/components/TreeTable'
import {
  getauthoritybyrole, // 获取角色的权限列表
  openAuthorityRole, // 开通权限
  closeAuthorityRole // 关闭权限
} from '@/api/setCenter'

export default {
  components: {
    treeTable
  },
  props: {
    roleid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: true,
      columns: [
        {
          text: this.$t('setCenter.selectedmodules'),
          value: 'authority'
        }
      ],
      data: [],
      expanded: [] // 树形表格已展开的节点
    }
  },
  watch: {
    roleid(newval, oldval) {
      if (newval !== oldval) {
        this.fetchRoleModule()
      }
    }
  },
  created() {

  },
  mounted() {
    this.fetchRoleModule()
  },
  methods: {

    // 获取角色权限列表
    fetchRoleModule() {
      const params = {
        roleId: this.roleid
      }
      getauthoritybyrole({ ...params }).then(res => {
        if (res.code === 200) {
          this.data = this.fromartExpand(res.data) || []
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },

    // 数据格式化
    fromartExpand(arr) {
      const newArr = []
      arr.map(item => {
        this.expanded.map(one => {
          if (one === item.id && !item.parent) {
            item._expanded = true
          }
        })
        if (item.parent === null) {
          newArr.push(item)
        }
        // newArr.push(item)
      })
      return newArr
    },

    // 开通此模块
    dredgeModule(row) {
      // this.$confirm('确定开通此模块?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const params = {
      //     authorityId: row.id,
      //     roleId: this.roleid,
      //     flag: row.parent ? 2 : 1
      //   }
      //   openAuthorityRole({ ...params }).then(res => {
      //     if (res.code === 200) {
      //       this.$message.success('开通成功')
      //       this.fetchRoleModule()
      //     } else {
      //       this.$message.error(res.msg)
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
      const params = {
        authorityId: row.id,
        roleId: this.roleid,
        flag: row.parent ? 2 : 1
      }
      openAuthorityRole({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('setCenter.opensuccess'))
          this.fetchRoleModule()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 关闭此模块
    closeModule(row) {
      // this.$confirm('确定关闭此模块?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const params = {
      //     authorityId: row.id,
      //     roleId: this.roleid,
      //     flag: row.parent ? 2 : 1
      //   }
      //   closeAuthorityRole({ ...params }).then(res => {
      //     if (res.code === 200) {
      //       this.$message.success('关闭成功')
      //       this.fetchRoleModule()
      //     } else {
      //       this.$message.error(res.msg)
      //     }
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });

      const params = {
        authorityId: row.id,
        roleId: this.roleid,
        flag: row.parent ? 2 : 1
      }
      closeAuthorityRole({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success(this.$t('setCenter.closesuccess'))
          this.fetchRoleModule()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 树形表格的回调
    expandedArr(arr) {
      console.log('arr', arr)
      this.expanded = arr
    }

  }
}
</script>
<style lang="scss" scoped>
  .indentleft{
    margin-left: 23px;
  }
</style>

