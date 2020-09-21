<template>
  <div class="return-money-container">
    <el-dialog :visible.sync="moneyDialog" title="退收款" width="400px" center @close="handClose(false)">
      <el-form ref="formData" :model="formData" :rules="formDataRule" label-width="100px">
        <el-form-item label="退款类型：">
          <el-radio-group v-model="formData.poundageType" @change="changeType">
            <el-radio-button label="REFUND">退款</el-radio-button>
            <!-- <el-radio-button :disabled="formData.payChannel !== 'ALIPAY_AUTH' || formData.payChannel !== 'JD_PERIODIC'" label="RECIEVE">收款</el-radio-button> -->
            <el-radio-button label="RECIEVE">收款</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.poundageType === 'REFUND'" label="退款金额：" prop="poundage">
          <el-input v-model.number="formData.poundage" class="input-200" placeholder="请输入退款金额"/>
        </el-form-item>
        <el-form-item v-if="formData.poundageType === 'RECIEVE'" label="收款金额：" prop="poundage">
          <el-input v-model.number="formData.poundage" class="input-200" placeholder="请输入收款金额"/>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formData.message" :rows="3" type="textarea" placeholder="填写备注，说明情况"/>
        </el-form-item>
        <hr class="line">
        <el-form-item v-if="formData.poundageType === 'REFUND'" label="应退金额：">
          <span v-if="String(formData.poundage) !== 'null'">{{ formData.poundage }}$</span>
        </el-form-item>
        <el-form-item v-if="formData.poundageType === 'REFUND'" label="应退押金：">
          <span v-if="String(formData.poundage) !== 'null'">{{ formData.deposit }}$</span>
        </el-form-item>
        <el-form-item v-if="formData.poundageType === 'RECIEVE'&& formData.deposit" :label="formData.poundage < formData.deposit ? '应退押金：' : '应扣金额'">
          <span v-if="formData.deposit < formData.poundage && formData.orderPayType === 1">请线下补差</span>
          <span v-else>{{ Math.abs(formData.deposit - formData.poundage).toFixed(2) }}$</span>
        </el-form-item>
        <el-form-item v-if="formData.poundageType === 'RECIEVE'&& !formData.deposit" label="应扣金额：">
          <span v-if="String(formData.poundage) !== 'null'">{{ formData.poundage }}$</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="handClose(false)">取消</el-button>
        <el-button type="primary" @click="handClose(true)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import refundApi from '@/api/order/refund.js'
import { deepClone } from '@/utils/index.js'
export default {
  components: {},
  props: {
    dialog: {
      type: Boolean,
      default: () => false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      moneyDialog: false,
      formData: {
        poundageType: 'REFUND'
      },
      formDataRule: {
        poundage: [{ required: true, message: '请填写退收款金额', trigger: 'blur' }]
      }
    }
  },
  watch: {
    dialog: {
      handler(val) {
        this.moneyDialog = val;
        console.log('退收款信息', this.dataSource);
        if (val) {
          this.formData = deepClone(this.dataSource);
        }
      }
    },
    dataSource: {
      handler(val) {

      }
    },
    deep: true
  },
  methods: {
    // 类型切换
    changeType(val) {
      this.$refs['formData'].clearValidate();
    },
    handClose(val) {
      if (val) {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            if (this.formData.poundageType === 'REFUND') {
              if (this.formData.poundage > this.formData.orderPaidAmount) {
                this.$message.warning('退款金额不能大于实付金额！');
                this.formData.poundage = null;
                return;
              }
            }
            // this.formData.refundNo = this.obj.refundNo;
            refundApi.returnMoney(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('退收款成功！');
                this.$emit('returnMoney', true);
              } else {
                this.$message.info(res.msg);
              }
            })
          } else {
            return false;
          }
        })
      } else {
        this.$emit('returnMoney', false)
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.line {
  width: 90%;
}
</style>
