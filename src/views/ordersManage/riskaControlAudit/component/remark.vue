<template>
  <div class="remark-container">
    <el-dialog :visible.sync="dialog" title="备注" center @close="cancel">
      <el-table :data="dataSource" border>
        <el-table-column prop="operateTime" label="时间"/>
        <el-table-column prop="content" label="内容"/>
        <el-table-column prop="username" label="操作人"/>
      </el-table>
      <div slot="footer">
        <el-button
          type="info"
          @click="cancel"
        >关闭</el-button>
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
      default: () => ([])
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
    cancel() {
      this.$emit('closeDialog');
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
