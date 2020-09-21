<template>
  <el-dialog :visible.sync="dialog" title="置为坏账" center class="dead-order" @close="cancel">
    <el-row :gutter="20">
      <el-col :span="8">
        <div>坏账备注：</div>
      </el-col>
      <el-col :span="14">
        <el-input v-model="remark" :rows="4" type="textarea" placeholder="请填写备注"/>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认置为坏账</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dueApi from '@/api/order/due.js'
export default {
  components: {},
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
      dialog: false,
      remark: ''
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.remark = '';
        }
      }
    }
  },
  methods: {

    // 提交
    submit() {
      if (!this.remark) {
        this.$message.warning('请填写备注');
        return;
      }

      this.$emit('handClose', { dialog: true, remark: this.remark });
    },

    // 关闭弹窗
    cancel() {
      this.$emit('handClose', { dialog: false });
      this.remark = '';
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.dead-order {
  .el-col-8 {
    div {
      text-align: right;
    }
  }
}
</style>
