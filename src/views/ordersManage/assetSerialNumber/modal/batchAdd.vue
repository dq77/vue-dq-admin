<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="title"
      width="520px"
      center
    >
      <div class="invenetorys-addmodule-content">
        <el-row class="el-row">
          <el-col span="8" class="leftlabel">
            <span>导入模板下载:</span>
          </el-col>
          <el-col span="8" >
            <a :href="`${baseUrl}/orders/sn_excel_download`" class="a">新增序列号模板.xlsx</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8" class="leftlabel">
            导入上传:
          </el-col>
          <el-col span="8" style="display:flex;">
            <el-upload
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :action="123"
              class="avatar-uploader"
            >
              <i v-if="serialNumberUpload" class="el-icon-document avatar-uploader-icon"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
              <el-tooltip :content="serialNumber" class="item" effect="dark" placement="top">
                <p class="text-overflow">{{ serialNumber }}</p>
              </el-tooltip>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="handleClose('cacel')">取 消</el-button>
        <el-button type="primary" @click="handleClose('ok')" >确 定</el-button>
      </span>
    <!-- 新增结果 -->
    </el-dialog>
    <Importresult :show="imvisible" :propdata="exportData" @handCancel="() => imvisible=false" />
  </div>
</template>
<script>

import elDragDialog from '@/directive/el-dragDialog'
import { batchAddSn } from '@/api/inventorys'
import { baseUrl } from '@/common/config.js'
import Importresult from './importresult' // 导入结果

export default {
  directives: { elDragDialog },
  components: {
    Importresult
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseUrl: baseUrl,
      visible: this.show,
      serialNumberUpload: false, // 序列号上传
      serialNumber: '上传序列号',
      title: '批量新增序列号',
      imvisible: false,
      exportData: {}, // 上传数据出现错误时
      file: ''
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

    // 关闭
    handleClose(val) {
      if (val === 'ok') {
        this.submit()
      } else if (val === 'cacel') {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('handCancel')
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel')
      }
    },

    // 上传钩子
    beforeAvatarUpload(file) {
      const fileType = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);
      if (fileType !== 'xlsx' && fileType !== 'xls') {
        return this.$message.error('请上传正确的文件类型')
      }
      this.serialNumberUpload = true
      this.serialNumber = file.name
      this.file = file
      return false // 返回false 阻止UI组件的自动上传实现自定义
    },

    // 上传文件后的处理
    uploadSuccess(data) {
      this.exportData = data
      this.imvisible = true
    },

    // 确定
    submit() {
      // 上传文件
      const fd = new FormData()
      fd.append('file', this.file)
      batchAddSn(fd).then(res => {
        if (res.code === 200) {
          this.uploadSuccess(res.data)
          this.$emit('handOk')
          this.serialNumberUpload = false
          this.serialNumber = '上传序列号'
          this.file = ''
        } else {
          this.$message.error('上传错误!')
        }
      })
    }

  }
}
</script>
<style lang="scss">
.invenetorys-addmodule-content{
  .avatar-uploader{
    margin-right: 16px;
  }
    .el-upload{
       border: 1px dashed #d9d9d9;
       border-radius: 6px;
       cursor: pointer;
       position: relative;
       overflow: hidden;
       background: #fafafa;
       p{
         position: absolute;
         bottom: 10px;
         left: 16px;
       }
     }
     .el-upload:hover{
         border-color: #409EFF;
       }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-row{
      margin-bottom: 16px;
    }
    .leftlabel{
      text-align: right;
      padding-right: 16px;
    }
    .a{
      color: #409EFF;
    }
    .text-overflow{
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 73%;
    }
}
</style>

