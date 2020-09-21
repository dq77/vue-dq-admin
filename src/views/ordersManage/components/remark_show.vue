<template>
  <div class="remark-show-container">
    <el-dialog
      :visible.sync="dialog"
      title="客服备注"
      center
      @close="cancel">
      <el-table :data="dataSource" border>
        <el-table-column label="时间" prop="operateTime"/>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="操作人" prop="username"/>
      </el-table>
      <div slot="footer">
        <el-button type="info" @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialog: false
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
    // 关闭弹窗
    cancel() {
      this.$emit('handClose')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
