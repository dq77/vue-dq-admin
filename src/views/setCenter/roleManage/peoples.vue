<!--
 * @Author: 刁琪
 * @Date: 2019-01-12 15:52:08
 * @LastEditors: your name
 * @LastEditTime: 2019-03-01 15:54:34
 -->
<template>
  <div class="table-wrap">
    <Table
      :columns="columns"
      :dataSource="tableData"
      :options="options"
      :fetch="fetchTableData"
      :pagination="pagination"
    />
  </div>
</template>
<script>
import Table from '@/components/tableList/tableList';
import {
  getadminbyrole // 查询角色下的用户列表
} from '../../../api/setCenter';

export default {
  components: {
    Table
  },
  props: {
    roleid: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      columns: [{
        prop: 'username',
        label: this.$t('setCenter.peoplename')
      }],
      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        initTable: true // 是否一挂载就加载数据
      },
      // 分页配置
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: []
    }
  },
  watch: {
    roleid(newval, oldval) {
      if (newval !== oldval) {
        this.fetchTableData()
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    // 获取表格数据
    fetchTableData() {
      console.log('人员:', this.roleid);
      if (!this.roleid) return
      const params = {
        roleId: this.roleid,
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }
      getadminbyrole({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || []
          this.pagination.total = res.data.totalCount || 0
          this.options.loading = false
        } else {
          this.options.loading = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrap{
  display: flex;
  flex:1;
}
</style>

