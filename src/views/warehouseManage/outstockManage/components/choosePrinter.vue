<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="choose-printer-dialog">
    <el-dialog :visible.sync="dialog" title="选择打印机" center width="470px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="可用打印机" prop="printer">
          <el-select v-model="formData.printer" placeholder="请选择打印机" class="input-300">
            <el-option
              v-for="item in dataSource"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save()">确认打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      printers: [],
      formData: {
        printer: ''
      },
      formRule: {
        printer: [
          { required: true, message: '请选择打印机', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource.length > 0) {
          this.printers = this.dataSource;
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 保存
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('handOk', this.formData);
          this.resetForm();
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
      this.$emit('handClose', 'chooseprintDlg');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.choose-printer-dialog {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .goodItem {
    border-bottom: 1px solid #aaa;
    padding-bottom: 4px;
    margin-bottom: 4px;
    .el-form-item--mini.el-form-item {
      margin-bottom: 4px;
    }
  }
}
</style>
