<template>
  <div id="uploadId" class="zwq-upload">
    <el-upload
      :action="options.imgUrl"
      :headers="token"
      :show-file-list="options.showFile"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :file-list="dataSource"
      :on-preview="onPreview"
      :limit="options.limit"
      :on-remove="onRemove"
      :class="['upload-demo', className]"
      drag
      list-type="picture-card"
    >
      <i class="el-icon-upload" />
      <div>{{ $t('good.candragup') }}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt >
    </el-dialog>
  </div>
</template>

<script>
import { imgBasePath } from '@/common/config.js';
import { getToken } from '@/utils/auth.js';
import Sortable from 'sortablejs';
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    dataSource: {
      tyep: Array,
      default: () => []
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // imgPath: `${imgBasePath}/goods/upload_img`,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      isLoading: false,
      token: {
        Authorization: getToken()
      }
    };
  },
  watch: {
    dataSource: {
      handler(val) {
        this.fileList = val;
      },
      deep: true
    }
  },
  updated() {
    if (!this.className) return;
    this.sortable();
  },
  methods: {
    // 拖拽商品图片
    sortable() {
      const el = document.querySelectorAll(`.${this.className} > ul`);
      for (let i = 0; i < el.length; i++) {
        this.createSortable(el[i]);
      }
    },
    createSortable(el) {
      Sortable.create(el, {
        animation: 150,
        onAdd: function(evt) {
          // 拖拽时候添加有新的节点的时候发生该事件
          console.log('onAdd.foo:', [evt.item, evt.from]);
        },
        onUpdate: function(evt) {
          // 拖拽更新节点位置发生该事件
          console.log('onUpdate.foo:', [evt.item, evt.from]);
        },
        onRemove: function(evt) {
          // 删除拖拽节点的时候促发该事件
          console.log('onRemove.foo:', [evt.item, evt.from]);
        },
        onStart: function(evt) {
          // 开始拖拽出发该函数
          console.log('onStart.foo:', [evt.item, evt.from]);
        },
        onSort: function(evt) {
          // 发生排序发生该事件
          console.log('onSort.foo:', [evt.item, evt.from]);
        },
        onEnd: evt => {
          // 拖拽完毕之后发生该事件
          console.log('onEnd.foo:', [evt.from]);
          const newArr = [];
          const arr = evt.from;
          for (let i = 0; i < arr.children.length; i++) {
            if (arr.children[i] && arr.children[i].children) {
              const str = arr.children[i].children[0].currentSrc;
              newArr.push(str);
            }
          }
          this.$emit('dragEvent', newArr);
        }
      });
    },
    // 上传图片检验
    beforeUpload(file) {
      console.log('上传格式', file.type);
      const isImg = this.options.formatList.indexOf(file.type);
      // const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < this.options.sizes;
      console.log('校验参数', isImg, isLt2M);
      if (isImg < 0) {
        this.$message.info(this.$t('good.uploadFormatOnly') + `${this.options.formatList}!`);
        return false;
      }
      if (!isLt2M) {
        console.log(this.$t('good.uploadSizeMax') + ` ${this.options.sizes}MB!`);
        this.$message.error(this.$t('good.uploadSizeMax') + ` ${this.options.sizes}MB!`);
        return false;
      }
      this.token.Authorization = getToken();
      this.$emit('beforeUpload', file);
      return isImg && isLt2M;
    },
    onSuccess(response, file, fileList) {
      console.log('上传成功response', response);
      console.log('上传成功file', file);
      console.log('上传成功fileList', fileList);
      if (response.code === 200) {
        this.$emit('onSuccess', response, file, fileList);
      } else {
        this.$message.error(this.$t('good.upimgerror'));
      }
    },
    onPreview(file) {
      console.log('查看图片', file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onRemove(file, fileList) {
      console.log('file', file, 'fileList', fileList);
      // if (this.options.formatList.indexOf(file.type) > 0) {
      if (file.status !== 'ready') {
        console.log('删除按钮', file, fileList);
        if (file && file.status === 'success') {
          console.log('组件删除图片文件', file, fileList);
          this.$emit('onRemove', file, fileList);
        } else {
          this.$message.warning(this.$t('good.deleteFailed'));
        }
      }
    }
    // }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.zwq-upload {
  .upload-demo {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
<style lang="scss">
.zwq-upload {
  .el-upload--picture-card {
    border: 0;
    min-height: 150px;
    line-height: 0;
  }
  .el-upload-dragger {
    width: 200px;
    height: 148px;
  }
}
</style>
