<!--
 * @Author: 刁琪
 * @Date: 2019-12-02 14:42:06
 * @LastEditors: your name
 * @LastEditTime: 2019-12-03 12:31:20
 -->
<template>
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
        <el-col :span="8" class="leftlabel">
          <span>{{ $t('warehouse.importtempdowm') }}:</span>
        </el-col>
        <el-col :span="8" class="modelDown">
          <a href="https://assets.taozugong.com/web/admin/AddSN.xlsx" target="_blank">AddSN.xlsx</a>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="leftlabel">
          {{ $t('warehouse.importupload') }}:
        </el-col>
        <el-col :span="8" style="display:flex;">
          <el-upload :show-file-list="false" :multiple="false" :before-upload="beforeUploadserialNumberFiles" action="https://httpbin.org/post" class="avatar-uploader">
            <!-- <img  :src="imageUrl" class="avatar"> -->
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
      <el-button @click="handleClose('cacel')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleClose('ok')" >{{ $t('common.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { readWorkbookFromLocalFile } from '../../../../utils/xlsx.js'
import elDragDialog from '@/directive/el-dragDialog'
import { baseUrl } from '@/common/config.js'
import {
  uploadasset // 批量上传
} from '@/api/inventorys'
import exportExcel from '../../../../utils/xlsx.js'

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
      title: this.$t('warehouse.addSNlot'),

      serialNumberUpload: false, // 序列号上传
      serialNumber: this.$t('warehouse.uploadSN'),
      vo: {}, // 上传数据
      errorList: [] // 上传序列号文件错误数据
    }
  },
  watch: {
    show() {
      this.visible = this.show
      this.serialNumberUpload = false
      this.serialNumber = this.$t('warehouse.uploadSN')
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
        this.$confirm(this.$t('setCenter.confirmclose'))
          .then(_ => {
            this.$emit('handCancel')
          })
          .catch(_ => {});
      } else {
        this.$emit('handCancel')
      }
    },

    // 序列号上传前
    beforeUploadserialNumberFiles(file) {
      const fileType = file.name.slice((file.name.lastIndexOf('.') - 1 >>> 0) + 2);

      if (fileType !== 'xlsx' && fileType !== 'xls') {
        return this.$message.error(this.$t('warehouse.uploadrighttype'))
      }
      this.vo = {}
      this.serialNumberUpload = true
      this.serialNumber = file.name
      readWorkbookFromLocalFile(file, this.readWorkbook)
    },
    readWorkbook(workbook) {
      const voList = []
      const errorList = []
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      let length = 0
      const col = ['A', 'B']
      const row = {
        A: 'erpCode',
        B: 'sn'
      }
      for (const value of Object.keys(sheet)) {
        if ((value.slice(1, 2) > length) && (col.includes(value.slice(0, 1)))) {
          length = value.slice(1, 2) - 0
        }
      }
      for (let i = 0; i <= length; i++) {
        voList.push({
          erpCode: '',
          sn: ''
        })
      }
      // 此处注释一下
      for (const key in sheet) {
        if (sheet[key].v) {
          voList[key.slice(1, 2)][row[key.slice(0, 1)]] = sheet[key].v
        }
      }
      voList.splice(0, 2)
      voList.map(item => {
        const patt = /^[0-9a-zA-z-_]+$/
        if (!item.erpCode) {
          errorList.push({
            'erpCode': item.erpCode,
            'sn': item.sn,
            'Error': this.$t('warehouse.erpcodenotept')
          })
        } else if (!item.sn) {
          errorList.push({
            'erpCode': item.erpCode,
            'sn': item.sn,
            'Error': this.$t('warehouse.snnotept')
          })
        } else if (!patt.test(item.sn)) {
          errorList.push({
            'erpCode': item.erpCode,
            'sn': item.sn,
            'Error': this.$t('warehouse.snrule')
          })
        }
        this.vo[item.erpCode] ? this.vo[item.erpCode].push(item.sn) : this.vo[item.erpCode] = [item.sn]
      })
      if (errorList.length > 0) {
        this.vo = {}
        this.serialNumberUpload = false
        this.serialNumber = ''
        this.$message.error(this.$t('warehouse.uperrmsg'))
        exportExcel(errorList, `Error${new Date().Format('yyyyMMdd')}.xlsx`)
      }
      console.log(this.vo);
    },

    // 确定 按钮
    confirmation() {
      if (!this.serialNumberUpload) {
        this.$message.error(this.$t('warehouse.uploadfileplz'))
        return false
      }
      const params = this.serialNumberUpload ? { erpCodeSns: { ...this.vo }} : undefined // 保证用户触发过上传行为
      uploadasset({ ...params }).then(res => {
        if (res.code === 200 && res.data) {
          this.$message.success(this.$t('common.addSuccess'))
          this.$emit('handOk')
        } else {
          this.$message.error(this.$t('warehouse.uperrmsg'))
          this.errorList = []
          this.downErrassetdata(JSON.parse(res.subMsg), res.code)
        }
      })
    },

    // 导出问题数据
    downErrassetdata(subMsg, code) {
      // 此处注释
      if (code === -1) {
        for (var key in subMsg) {
          Object.keys(subMsg[key]).map(item => {
            if (subMsg[key][item]) {
              this.errorList.push({
                'erpCode': key,
                'sn': item,
                'Error': this.$t('warehouse.snrepeat')
              })
            }
          })
        }
      } else if (code === 10601) {
        subMsg.map(item => {
          this.errorList.push({
            'erpCode': item,
            'Error': this.$t('warehouse.erpcodeError')
          })
        })
      }
      exportExcel(this.errorList, `Error${new Date().Format('yyyyMMdd')}.xlsx`)
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

