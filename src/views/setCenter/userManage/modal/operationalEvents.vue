<!--
 * @Author: 刁琪
 * @Date: 2019-01-12 10:01:15
 * @LastEditors: your name
 * @LastEditTime: 2019-02-27 14:39:54
 -->
<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="$t('common.actionsLog')"
      width="680px"
      center
    >
      <div class="table-wrap">
        <Table
          :columns="columns"
          :dataSource="tableData"
          :options="options"
          :fetch="fetchTableData"
          :pagination="pagination"
        />
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleClose('ok')" >{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import Table from '@/components/tableList/tableList';
import {
  usermodifylist // 时间列表
} from '@/api/setCenter'

export default {
  components: {
    Table
  },
  directives: { elDragDialog },
  props: {
    show: { type: Boolean, default: true }
  },
  data() {
    return {
      visible: this.show,
      // 表格配置
      columns: [
        {
          prop: 'gmtCreate',
          label: this.$t('setCenter.time')
        }, {
          prop: 'username',
          label: this.$t('setCenter.username')
        }, {
          prop: 'detail',
          label: this.$t('setCenter.event')
        }
      ],
      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        border: true,
        initTable: true, // 是否一挂载就加载数据
        maxheight: 300 // 传值代表表头固定
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
    show: function() {
      this.visible = this.show;
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    // 获取表格数据
    fetchTableData() {
      const params = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }
      usermodifylist({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || []
          this.pagination.total = res.data.totalCount
          this.options.loading = false
        } else {
          this.$message.error(res.msg)
          this.options.loading = false
        }
      })
    },
    // 关闭
    handleClose(val) {
      if (val === 'ok') {
        this.$emit('handOk')
      } else if (val === 'cacel') {
        this.$confirm(this.$t('setCenter.confirmclose'))
          .then(_ => {
            this.$emit('handCancel')
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel')
      }
    }
  }
}
</script>
<style lang="scss">
.el-dialog--center .el-dialog__body{
  padding-bottom: 0;
}
</style>

