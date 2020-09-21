<template>
  <div class="banner-detail">
    <el-dialog
      :visible.sync="dialogVisible"
      title="详情"
      center
      width="50%"
      @close="close">
      <el-form label-width="100px">
        <el-form-item label="名称：">
          <span>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="渠道：">
          <span>{{ formData.channelCode }}</span>
        </el-form-item>
        <el-form-item label="类型：">
          <span v-if="formData.type == 0">商品</span>
          <span v-if="formData.type == 10">活动</span>
        </el-form-item>
        <el-form-item label="内容：">
          <span>{{ formData.content }}</span>
        </el-form-item>
        <el-form-item label="状态：">
          <span v-if="formData.status == 20">上架</span>
          <span v-if="formData.status == 10">下架</span>
        </el-form-item>
        <el-form-item label="描述：">
          <span>{{ formData.describe }}</span>
        </el-form-item>
        <el-form-item label="图片：">
          <img :src="formData.basePictureUrl + formData.img" alt="banner图" style="width:80%">
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
  components: {},
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    formObj: {
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
    dialog(value) {
      this.dialogVisible = value;
      this.formData = this.formObj;
      console.log('this.form', this.formData);
    }
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
