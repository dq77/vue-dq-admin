<template>
  <el-dialog
    :visible.sync="visible"
    title="新增备注"
    width="520px"
    center
    @close="handleClose('cacel')">
    <el-row :gutter="16">
      <el-col :span="8" class="left-padding">
        <span>新增备注:</span>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          :maxlength="50"
          type="textarea"
          class="input-200"
          placeholder="请输入备注"
        />
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button @click="handleClose('cacel')">取消</el-button>
      <el-button type="primary" @click="handleClose('ok')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.show,
      remark: ''
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleClose(val) {
      if (val === 'ok') {
        if (!this.remark) {
          this.$message.warning('空备注不能提交！');
          return;
        }
        this.$emit('handOk', this.remark);
      } else if (val === 'cacel') {
        this.remark = '';
        this.$emit('handCancel')
      } else {
        this.$emit('handCancel')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left-padding{
    text-align: right
  }
</style>

