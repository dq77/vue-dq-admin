<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload
      :action="imgBasePath"
      :headers="token"
      :before-upload="beforeUpload"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag>
      <i class="el-icon-upload"/>
      <!-- <div class="el-upload__text">Drag或<em>点击上传</em></div> -->
    </el-upload>
    <div v-show="imageUrl && imageUrl.length>0" class="image-preview">
      <div v-show="imageUrl.length>1" class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js'
import { imgBasePath } from '@/common/config.js'
export default {
  name: 'SingleImageUpload2',
  props: {
    value: {
      type: String,
      default: ''
    },
    base: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      imgBasePath: `${imgBasePath}/goods/brand_management/upload_img`,
      dataObj: { token: '', key: '' },
      token: {
        Authorization: getToken()
      }
    }
  },
  computed: {
    imageUrl() {
      console.log('图片路径2342', this.base);
      console.log('图片路径23', this.value);
      if (this.value) {
        return `${this.base}${this.value}`;
      } else {
        return ''
      }
    }
  },
  watch: {
    base: {
      handler(value) {
        console.log('公共路径', value);
      }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(response, file, fileList) {
      console.log('成功', response);
      if (response.code === 200) {
        this.emitInput(response.data)
      } else {
        this.$message.error(this.$t('good.upimgerror'));
      }
    },
    beforeUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isImg) {
        this.$message.error(this.$t('good.upimgformat'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('good.upimglimit'))
      }
      this.token.Authorization = getToken();
      return isImg && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 30%;
  height: 100%;
  position: relative;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
