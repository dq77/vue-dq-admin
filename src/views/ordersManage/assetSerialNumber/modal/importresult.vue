<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="handleClose"
    title="导入结果"
    width="520px"
    center
  >
    <el-row class="el-row">
      <el-alert
        :closable="false"
        title="成功导入:"
        type="success"
        show-icon>
        {{ propdata.successNum }} 个资产序列号
      </el-alert>
    </el-row>
    <el-row>
      <el-alert
        :closable="false"
        title="未成功导入:"
        type="error"
        show-icon>
        {{ propdata.failNum }} 个资产序列号
        <a v-if="propdata.length > 0" class="a" @click="exportFile">下载</a>
      </el-alert>
    </el-row>
    <!-- 导出系列号问题数据 -->
    <form :action="`${baseUrl}/orders/export_sn_result`" style="display:none" method="post" class="formser" target="_blank"/>
  </el-dialog>
</template>

<script>
import { baseUrl } from '@/common/config.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    propdata: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.show,
      baseUrl: baseUrl
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {

    handleClose() {
      this.$emit('handCancel')
    },

    // 导出错误文件
    exportFile() {
      const params = {
        failList: JSON.stringify(this.propdata.snExcelVos)
      }
      this.updfilex(params)
    },

    // 下载序列号
    updfilex(params) {
      const form = document.querySelector('.formser')
      for (var key in params) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }
      form.submit();
      return form
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 16px;
}
.a{
  color: #4da9ec;
}
</style>

