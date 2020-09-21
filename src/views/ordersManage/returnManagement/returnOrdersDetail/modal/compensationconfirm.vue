<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="Visible"
      title="补差确认"
      width="520px"
      center
      @close="close">
      <div>
        <el-form ref="formData" :model="formData" :rules="formDataRule" label-width="35%">
          <el-form-item label="退收款方式：">
            <span>线下补差</span>
          </el-form-item>
          <el-form-item label="应补差:" prop="one">
            <el-input v-model.number="userForm.poundage" :maxlength="10" class="input-220" disabled/>
          </el-form-item>
          <el-form-item label="实际补差:" prop="paidPoundage">
            <el-input v-model.number="formData.paidPoundage" :maxlength="11" class="input-220" placeholder="请输入用户线下补差金额"/>
          </el-form-item>
          <el-form-item label="补差描述:" prop="remark">
            <el-input
              v-model="remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              :maxlength="50"
              type="textarea"
              placeholder="请输入内容"
              class="input-220"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('cacel')">取 消</el-button>
        <el-button type="primary" @click="handleClose('ok')" >已确认补差</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'

export default {
  directives: { elDragDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写实际补差'));
      } else {
        if (value * 1 < 0) {
          callback(new Error('实际补差要大于0'));
        } else {
          callback();
        }
      }
    };
    return {
      Visible: this.show,
      userForm: {},
      paidPoundage: '',
      remark: '',
      formData: {
        paidPoundage: ''
      },
      formDataRule: {
        paidPoundage: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.Visible = val;
        this.userForm = this.dataSource;
        if (!val) {
          this.resetForm();
        }
      }
    },
    dataSource: {
      handler(val) {
        this.userForm = val;
      },
      deep: true
    }
  },
  methods: {

    resetForm() {
      this.userForm = {};
      this.$refs['formData'].clearValidate();
    },

    handleClose(val) {
      if (val === 'ok') {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            const data = {
              refundNo: this.userForm.refundNo,
              paidPoundage: this.formData.paidPoundage,
              message: this.remark
            }
            this.$emit('handOk', data);
            this.resetForm();
          } else {
            return false
          }
        })
      } else if (val === 'cacel') {
        this.$emit('handCancel');
        this.resetForm();
      }
    },
    close() {
      this.$emit('handCancel');
      this.userForm = {};
      this.$refs['formData'].clearValidate();
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

