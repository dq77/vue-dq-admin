<template>
  <div class="afterSale-container">
    <el-dialog :visible.sync="dialog" :title="$t('good.editservtemp')" center width="1000px" @close="closeDialog">
      <upload
        :options="options"
        :data-source="picList"
        class-name="cover-upload"
        @onRemove="remove"
        @onSuccess="success"
        @dragEvent="coverDrag"/>
      <div slot="footer">
        <el-button type="info" @click="cancel">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload/upload.vue'
import { imgBasePath } from '@/common/config.js'
export default {
  components: {
    Upload
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dialog: false,
      options: {
        imgUrl: `${imgBasePath}/goods/upload_img`,
        showFile: true,
        sizes: 5,
        formatList: ['image/jpeg', 'image/jpg', 'image/png']
      },
      picList: []

    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.picList = this.picFilter(this.dataSource);
        } else {
          this.picList = [];
        }
      }
    }

  },
  methods: {
    picFilter(val) {
      return val.afterSaleImg.map(item => {
        return {
          url: val.baseImgUrl + item
        }
      })
    },
    closeDialog() {
      this.$emit('handClose')
    },
    coverDrag() {},
    success(file, fileList) {
      console.log('file', file, 'fileList', fileList);
      this.picList.push({ url: file.data.baseImgUrl + file.data.imgRout })
    },
    remove(file, fileList) {
      console.log('file', file, 'fileList', fileList);
      this.picList = fileList;
    },
    submit() {
      if (this.picList.length < 1) {
        this.$message.warning(this.$t('good.uploadImgPlz'))
        return
      }
      const arr = this.picList.map(item => {
        return item.url.slice(this.dataSource.baseImgUrl.length);
      })
      console.log('获取数据', arr);
      this.$emit('handOK', arr)
    },
    cancel() {
      this.$emit('handClose')
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.afterSale-container {}

</style>
