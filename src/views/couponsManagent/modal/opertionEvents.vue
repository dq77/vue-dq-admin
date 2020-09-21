<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    title="查询操作事件"
    width="520"
    center>
    <el-table :data="gridData" :max-height="500" border>
      <el-table-column property="operateTime" label="时间" width="200"/>
      <el-table-column property="content" label="事件"/>
      <el-table-column property="username" label="用户名" width="200"/>
    </el-table>
  </el-dialog>
</template>
<script>
import couponApi from '@/api/coupon.js'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      pagedetail: 1,
      pageSizedetail: 10,
      totaldetail: 0,
      visible: this.show,
      gridData: []
    }
  },
  watch: {
    show() {
      this.visible = this.show;
      console.log('couponId', this.dataSource);
      this.getLog(this.dataSource.id);
    }
  },
  methods: {
    getLog(id) {
      couponApi.couponeLog({ couponId: id }).then(res => {
        if (res.code === 200) {
          this.gridData = res.data;
        }
      })
    },
    handleClose(val) {
      this.$emit('updatevisible')
    },

    handleSizeChangedetail() {

    },

    handleCurrentChangedetail() {

    }
  }
}
</script>
<style lang="scss" scoped>
.block{
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

