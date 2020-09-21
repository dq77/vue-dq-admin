<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="change-send-dialog">
    <el-dialog :visible.sync="dialog" title="绑定货运单号" center width="470px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="货运单号" prop="trackingNo">
          <el-input v-model="formData.trackingNo"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save()">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import outstockApi from '@/api/warehouse/outstock'
export default {
  components: {},
  props: {
    dataSource: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      formData: {
        freight: {},
        trackingNo: ''
      },
      formRule: {
        trackingNo: [
          { required: true, message: '请输入货运单号', trigger: 'blur' }
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
        if (val && this.dataSource) {
          this.formData.freight = this.dataSource.freight;
        }
      }
    }
  },
  mounted() {
    // this.getFreights()
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
          this.$refs['formData'].resetFields();
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].resetFields();
      this.$refs['formData'].clearValidate();
      this.formData = {
        freight: {},
        trackingNo: ''
      };
      this.$emit('handClose', 'outTrackNoDlg');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.change-send-dialog {
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
