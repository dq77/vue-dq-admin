<template>
  <div v-if="dialog" class="pay-info-container">
    <el-dialog :visible.sync="dialog" title="查看日志" center @close="handClose">
      <div class="head-btn">
        <el-button v-if="!orderObj.paidType" type="primary" @click="pay()">支付接口</el-button>
        <el-button v-if="!orderObj.paidType" type="primary" @click="offLine()">线下补差</el-button>
        <span v-if="orderObj.paidType === 'OFFLINE'" class="text-center">已线下补差（金额<span>{{ orderObj.paidPoundage }})</span></span>
        <span v-if="orderObj.paidType === 'ONLINE'" class="text-center"><span v-if="orderObj.poundageType === 'RECIEVE'">系统收款</span><span v-if="orderObj.poundageType === 'REFUND'">系统退款</span>（金额<span>{{ orderObj.paidPoundage }})</span></span>
      </div>
      <el-table v-if="orderObj.paidType !== 'OFFLINE'" :data="billData" border>
        <el-table-column label="退款类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'MONEY_BACK'">退款</span>
            <span v-if="scope.row.type === 'ALIPAY_AUTH_UNFREEZE'">预授权解冻</span>
            <span v-if="scope.row.type === 'JD_DEPOSIT_UNFREEZE'">押金退回</span>
            <span v-if="!scope.row.type">/</span>
          </template>
        </el-table-column>
        <el-table-column label="第三方流水号" prop="tradeNo"/>
        <el-table-column :label="orderObj.poundageType === 'RECIEVE' ? '收款金额' : '退款金额'">
          <template slot-scope="scope">
            <span>{{ scope.row.refundAmountYuan }}$</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="gmtCreated"/>
        <el-table-column label="状态" prop="responseDes"/>
        <el-table-column label="操作人" prop="operatorName"/>
      </el-table>
    </el-dialog>
    <compensationconfirm :show="ccVisisble" :data-source="orderObj" @handOk="ccHandOk" @handCancel="ccHandCancel"/>
  </div>
</template>

<script>
import compensationconfirm from './compensationconfirm'
import refundApi from '@/api/order/refund.js'
import billApi from '@/api/order/bill.js'
export default {
  components: {
    compensationconfirm
  },
  props: {
    payInfoDialog: {
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
      dialog: false,
      ccVisisble: false,
      orderObj: {},
      billData: []
    }
  },
  computed: {
    order() {
      console.log('计算属性');
      return this.orderObj;
    }
  },
  watch: {
    payInfoDialog: {
      handler(val) {
        this.dialog = val;
        if (val) {
          console.log('退收款日志', this.dataSource);
          this.getLog(this.dataSource.oid, this.dataSource.tid);
          this.orderObj = this.dataSource;
          console.log('测试渲染', this.orderObj);
        }
      }
    },
    dataSource: {
      handler(val) {
        // this.orderObj = val;
      },
      deep: true
    }
  },
  created() {
    console.log('申明走后期');
  },
  methods: {
    getLog(oid, tid) {
      const data = {
        recordNo: oid,
        orderNo: tid
      }
      billApi.payInfo(data).then(res => {
        if (res.code === 200) {
          console.log('退收款res', res);
          this.billData = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 接口调用
    pay() {
      const data = {
        refundNo: this.orderObj.refundNo,
        recordNo: this.orderObj.oid,
        amount: this.orderObj.poundage,
        forRefund: this.orderObj.poundageType !== 'RECEIVE' // true 退款  false 收款
      }
      billApi.payReturn(data).then(res => {
        if (res.code === 200) {
          this.$message.success('支付成功！');
          this.$emit('handClose', true);
        }
      })
    },
    offLine() {
      this.ccVisisble = true;
    },
    ccHandOk(data) {
      refundApi.confirmOffLine(data).then(res => {
        if (res.code === 200) {
          this.$message.success('确认成功！');
          this.$emit('handClose', true);
          this.ccVisisble = false;
        }
      })
    },
    ccHandCancel() {
      this.ccVisisble = false;
    },
    handClose() {
      this.$emit('handClose', false);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .head-btn {
    margin-bottom: 15px;
  }
  .text-center {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
</style>
