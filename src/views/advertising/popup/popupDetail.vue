<template>
  <div class="banner-detail">
    <el-dialog
      :visible.sync="dialogVisible"
      title="详情"
      center
      width="50%"
      @close="close">
      <el-form label-width="100px">
        <el-form-item v-if="formData.spuNo" label="商品编号：" >
          <span>{{ formData.spuNo }}</span>
        </el-form-item>
        <el-form-item label="活动渠道：">
          <span>{{ formData.channelCode | channelFilter }}</span>
        </el-form-item>
        <el-form-item label="活动类型：">
          <span v-if="formData.activeUrl">活动</span>
          <span v-if="formData.spuNo">商品</span>
        </el-form-item>
        <el-form-item v-if="formData.activeUrl" label="活动链接：" >
          <span>{{ formData.activeUrl }}</span>
        </el-form-item>
        <el-form-item label="活动状态：">
          <span v-if="formData.status == 20">启用</span>
          <span v-if="formData.status == 10">禁用</span>
        </el-form-item>
        <el-form-item label="活动图片：">
          <img :src="formData.baseUrl + formData.imgUrl" alt="banner图" style="width:80%">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="ok()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    detailDialog: {
      type: Boolean,
      default: false
    },
    bannerObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      formData: {}
    };
  },
  watch: {
    detailDialog(value) {
      this.dialogVisible = value;
    },
    bannerObj(value) {
      console.log('value', value);
      this.formData = value;
    },
    deep: true
  },
  methods: {
    ok() {
      this.$emit('viewDetail');
    },
    close() {
      this.$emit('viewDetail');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
</style>
