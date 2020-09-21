<template>
  <div class="return-confirm">
    <el-dialog :visible.sync="dialog" title="确认回仓" center width="700px" @close="closeDialog">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="250px" status-icon>
        <el-form-item label="归还方式：">
          <span>{{ expressInfo.expCompany }}</span>
        </el-form-item>
        <el-form-item label="归还时间：">
          <span>{{ expressInfo.deliveryTime }}</span>
        </el-form-item>
        <el-form-item v-if="expressInfo.apiCode !== 'PS' && expressInfo.apiCode !== 'ZT'" label="物流单号：">
          <span>{{ expressInfo.expCode }}</span>
          <!-- <el-button type="text">查询物流</el-button> -->
        </el-form-item>
        <logistic :info="logisticData"/>
        <div class="expand-express">
          <el-button type="text" size="small" @click="expandExpress">
            <span v-if="!expand">查看更多物流详情</span>
            <span v-if="expand">收起物流详情</span>
          </el-button>
        </div>
        <el-form-item label="回仓时间：" prop="backConfirmTime">
          <el-date-picker
            v-model="formData.backConfirmTime"
            type="datetime"
            placeholder="选择日期时间"/>
        </el-form-item>
        <el-form-item label="是否需要赔偿：" prop="needPay">
          <el-radio-group v-model="formData.needPay">
            <el-radio :label="false">无</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.needPay">
          <el-form-item v-if="this.dataSource.payChannel === 'JD_PERIODIC' || dataSource.payChannel === 'JD_H5'" label="押金：">
            <div>{{ this.dataSource.restDeposit }}$</div>
            <div>有押金/剩余预授冻结金额，则可以用于赔偿，不够则需要线下转账，没有赔偿金额，则押金/剩余预授冻结金额将退回/解冻</div>
          </el-form-item>
          <el-form-item v-if="this.dataSource.payChannel === 'ALIPAY_AUTH' || dataSource.payChannel === 'HUA_BEI'" label="剩余预授冻结金额：">
            <div>{{ this.dataSource.restDeposit }}$</div>
            <div>有押金/剩余预授冻结金额，则可以用于赔偿，不够则需要线下转账，没有赔偿金额，则押金/剩余预授冻结金额将退回/解冻</div>
          </el-form-item>
          <el-form-item label="扣除金额：" prop="shouXuMoney">
            <el-input v-model="formData.shouXuMoney" class="input-220" placeholder="最多不能超过押金/剩余预授金额"/>
          </el-form-item>
          <el-form-item label="是否有线下补差：" prop="payType">
            <el-radio-group v-model="formData.payType">
              <el-radio label="ONLINE">无</el-radio>
              <el-radio label="OFFLINE">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="到期回仓备注：" prop="reamrk">
          <el-input v-model="formData.remark" :rows="4" type="textarea" class="input-300" placeholder="请填写备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit('formData')">确认已回仓</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="remarkDialog"
      title="客服备注"
      center>
      <el-table :data="data.sellerRemark" border>
        <el-table-column label="时间" prop="operateTime"/>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="操作人" prop="username"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
import qs from 'qs'
import logistic from '../../orderlist/components/logistic'
export default {
  components: {
    logistic
  },
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
    var checkShouXu = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('金额不能为空'));
      } else if (isNaN(value)) {
        return callback(new Error('只能填写数字'));
      } else if (value * 1 > this.dataSource.restDeposit * 1) {
        return callback(new Error('不能超过押金/剩余预授金额'))
      } else {
        callback();
      }
    }
    return {
      orderObj: {},
      logisticData: [], // 物流详情
      expand: false, // 是否展开 true 是， false 否
      expressInfo: {}, // 查询的物流详情
      remarkDialog: false,
      radio: 0,
      dialog: false,
      formData: {
        backConfirmTime: '',
        needPay: false,
        shouXuMoney: '',
        payType: 'ONLINE',
        remark: ''
      },
      goodsType: 1, // 货物损坏状态 1 未损坏 2 有损坏
      shouXuMoney: 0, // 货物损坏赔偿金额
      data: [],
      formRule: {
        remark: [
          { required: true, message: '建议填写备注', trigger: 'blur' }
        ],
        backConfirmTime: [
          {
            required: true, message: '请选择回仓时间', trigger: 'blur'
          }
        ],
        shouXuMoney: [
          {
            validator: checkShouXu, trigger: 'blur'
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
          this.getExpressInfo(this.dataSource.orderDetailVos ? this.dataSource.orderDetailVos[0].oid : '')
        }
      }
    }
  },
  created() {

  },
  methods: {

    // 获取物流详情
    getExpressInfo(no) {
      const data = {
        orderNo: no,
        expressType: 'EXPIRE_BACK'
      }
      orderApi.expressDetail(data).then(res => {
        if (res.code === 200) {
          this.expressInfo = res.data;
          this.expressHalf();
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 点击展开物流详情
    expandExpress() {
      this.expand = !this.expand;
      this.expressHalf();
    },
    // 获取前半部分展示
    expressHalf() {
      if (this.expressInfo && this.expressInfo.expInfo.length > 3) {
        if (!this.expand) {
          this.logisticData = this.expressInfo.expInfo.slice(0, 3);
        } else {
          this.logisticData = this.expressInfo.expInfo;
        }
      } else {
        this.logisticData = this.expressInfo.expInfo;
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('handCose', false);
      this.resetForm();
    },

    // 确认收货
    submit(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          const data = {
            oid: this.dataSource.orderDetailVos ? this.dataSource.orderDetailVos[0].oid : '',
            ...this.formData
          }
          if (!data.needPay) {
            data.shouXuMoney = '';
            data.payType = '';
          }
          orderApi.backConfirm(data).then(res => {
            if (res.code === 200) {
              this.$message.success('收货成功！');
              this.$emit('handOk', true);
              this.resetForm();
            } else {
              this.$message.info(res.msg);
            }
          })
        } else {
          return false;
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].clearValidate();
      this.$refs['formData'].resetFields();
      this.dialog = false;
    },
    // getDetail(data) {
    //   orderApi.orderDetail(data).then(res => {
    //     if (res.code === 200) {
    //       this.data = res.data;
    //       this.dataSource.orderDetailVos[0] = res.data.orderDetailVos[0];
    //       this.radio = 0;
    //     } else {
    //       this.$message.info(res.msg);
    //     }
    //   })
    // },
    // 查看客服备注
    viewRemark() {
      this.remarkDialog = true;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.el-radio {
  margin-left: 0;
  margin-bottom: 8px;

}
  .expand-express {
    padding: 10px 0 20px;
    text-align: center;
  }
</style>
