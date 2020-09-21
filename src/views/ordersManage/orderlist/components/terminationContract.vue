<template>
  <div class="termination-container">
    <el-dialog :visible.sync="dialog" title="解约" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="150px" status-icon>
        <el-form-item v-if="dataSource.payChannel === 'ALIPAY_AUTH' || dataSource.payChannel === 'HUA_BEI'" label="剩余冻结">
          <span>{{ formData.preUnfreezeAmount }}</span>
        </el-form-item>
        <el-form-item v-if="dataSource.payChannel === 'ALIPAY_AUTH' || dataSource.payChannel === 'HUA_BEI'" label="解冻金额" prop="needUnfreezeAmount">
          <el-input v-model="formData.needUnfreezeAmount" class="input-220" placeholder="解冻金额"/>
        </el-form-item>
        <el-form-item v-if="dataSource.payChannel === 'JD_PERIODIC' || dataSource.payChannel === 'JD_H5'" label="押金">
          <span>{{ formData.preUnfreezeAmount }}</span>
        </el-form-item>
        <el-form-item v-if="dataSource.payChannel === 'JD_PERIODIC' || dataSource.payChannel === 'JD_H5'" label="退还金额" prop="needUnfreezeAmount">
          <el-input v-model="formData.needUnfreezeAmount" class="input-220" placeholder="请填写退还金额"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" :rows="4" type="textarea" class="input-220" placeholder="请填写备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定解冻</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
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
    var checkNum = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('解冻金额不能为空!'));
      } else if (isNaN(value)) {
        return callback(new Error('只能填数字！'));
      } else if (value * 1 > this.formData.preUnfreezeAmount * 1) {
        return callback(new Error('不能大于冻结金额！'));
      } else {
        callback();
      }
    }
    return {
      dialog: false,
      formData: {
        needUnfreezeAmount: '',
        remark: ''
      },
      formRule: {
        needUnfreezeAmount: [
          {
            validator: checkNum, trigger: 'blur'
            // required: true, message: '请填写金额', trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.formData = { ...this.dataSource }
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {

    // 提交
    submit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('handClose', true, this.formData)
        }
      })
    },

    // 取消
    cancel() {
      this.$emit('handClose', false)
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].validate();
      this.$refs['formData'].resetFields();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
