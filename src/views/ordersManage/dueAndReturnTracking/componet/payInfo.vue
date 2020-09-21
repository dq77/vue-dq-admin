<template>
  <el-dialog :visible.sync="dialog" title="查看日志" center @close="closeDialog">
    <el-button type="primary" @click="tryAgain">重试</el-button>
    <el-table :data="tableData" border>
      <el-table-column label="时间"/>
      <el-table-column label="第三方流水号"/>
      <el-table-column label="类型"/>
      <el-table-column label="金额"/>
      <el-table-column label="状态"/>
      <el-table-column label="接口详细信息"/>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      tableData: []
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('handClose', false)
    },
    tryAgain() {}
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
