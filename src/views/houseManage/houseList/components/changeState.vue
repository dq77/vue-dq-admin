<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 李圆圆
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="change-house-state-dialog">
    <el-dialog :visible.sync="dialog" title="修改房源状态" center width="400px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="当前状态" prop="enabled">
          <span>{{ status(formData.status) }}</span>
        </el-form-item>
        <el-form-item label="修改后状态" prop="afterChangeState">
          <el-select v-model="formData.afterChangeState" placeholder="请选择状态" class="input-200">
            <el-option label="寻租中" value="1" />
            <el-option label="已出租" value="2" />
            <el-option label="已下架" value="3" />
          </el-select>
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
// import warehouseApi from '@/api/warehouse/warehouse';
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
      dialog: this.show, // 弹窗标志
      formData: {
        id: '',
        status: '',
        afterChangeState: ''
      },
      freightList: [],
      formRule: {
        afterChangeState: [
          { required: true, message: '请选择房源状态', trigger: 'change' }
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
          this.formData.status = this.dataSource.status;
          this.formData.id = this.dataSource.id;
        }
      }
    }
  },
  methods: {
    // 房屋状态 显示
    status(val) {
      switch (val * 1) {
        case 1:
          return '寻租中';

        case 2:
          return '出租中';

        case 3:
          return '已下架';
      }
    },

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
        status: {},
        afterChangeState: ''
      };
      this.$emit('handClose', 'outSendDlg');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.change-house-state-dialog {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
}
</style>
