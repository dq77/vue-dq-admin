<!--
 * @Author: diaoqi
 * @Date: 2019-12-02 14:42:06
 * @LastEditors: diaoqi
 * @LastEditTime: 2019-12-03 12:31:20
 -->
<template>
  <el-dialog v-el-drag-dialog :visible.sync="visible" :before-close="handleClose" :title="title" width="520px" center>
    <div class="invenetorys-addmodule-content">
      <el-row>
        <el-col :span="8" class="leftlabel">
          批量导入:
        </el-col>
        <el-col :span="8" style="display:flex;">
          <el-upload :show-file-list="false" :multiple="false" :before-upload="beforeUploadserialNumberFiles" action="https://httpbin.org/post" class="avatar-uploader">
            <!-- <img  :src="imageUrl" class="avatar"> -->
            <i v-if="serialNumberUpload" class="el-icon-document avatar-uploader-icon"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <!-- <el-tooltip :content="serialNumber" class="item" effect="dark" placement="top"> -->
            <p class="text-overflow">{{ serialNumber }}</p>
            <!-- </el-tooltip> -->
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleClose('cacel')">取 消</el-button>
      <el-button type="primary" @click="handleClose('ok')" >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { readWorkbookFromLocalFile } from '../../../../utils/xlsx.js'
import elDragDialog from '@/directive/el-dragDialog'
import { baseUrl } from '@/common/config.js'

export default {
  directives: { elDragDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.show,
      baseUrl: baseUrl,
      title: '批量导入序列号',

      serialNumberUpload: false, // 序列号上传
      serialNumber: '上传序列号',
      vo: {}, // 上传数据
      errorList: [] // 上传序列号文件错误数据
    }
  },
  watch: {
    show() {
      this.visible = this.show
      this.serialNumberUpload = false
      this.serialNumber = '上传序列号'
      this.purchaseUpload = false
      this.purchase = '上传采购单'
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    handleClose(val) {
      if (val === 'ok') {
        this.confirmation()
      } else if (val === 'cacel') {
        this.$emit('handCancel')
      } else {
        this.$emit('handCancel')
      }
    },

    // 序列号上传前
    beforeUploadserialNumberFiles(file) {
      const fileType = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);

      if (fileType !== 'xlsx' && fileType !== 'xls') {
        return this.$message.error('请上传正确的文件类型')
      }
      this.vo = {}
      this.serialNumberUpload = true
      this.serialNumber = file.name
      readWorkbookFromLocalFile(file, this.readWorkbook)
    },
    readWorkbook(workbook) {
      const voList = []
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      let length = 0
      const col = ['B', 'C']
      const row = {
        B: 'SKU_ID',
        C: 'sn'
      }
      for (const value of Object.keys(sheet)) {
        if ((value.slice(1) > length) && (col.includes(value.slice(0, 1)))) {
          length = value.slice(1) - 0
        }
      }
      for (let i = 0; i <= length; i++) {
        voList.push({
          SKU_ID: '',
          sn: ''
        })
      }
      // 此处注释一下
      for (const key in sheet) {
        if (sheet[key].v) {
          voList[key.slice(1)][row[key.slice(0, 1)]] = sheet[key].v
        }
      }
      voList.splice(0, 2)
      voList.map(item => {
        this.vo[item.SKU_ID] ? this.vo[item.SKU_ID].push(item.sn) : this.vo[item.SKU_ID] = [item.sn]
      })
      console.log(this.vo);
    },

    // 确定 按钮
    confirmation() {
      if (!this.serialNumberUpload) {
        this.$message.error('请上传文件')
        return false
      }
      this.$emit('handOk', this.vo)
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
    .modelDown{
      margin-bottom: 4px;
      a, a:hover, a:active, a:visited{
        color: #409EFF;
      }
    }
}
.text-overflow{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 73%;
}
</style>

