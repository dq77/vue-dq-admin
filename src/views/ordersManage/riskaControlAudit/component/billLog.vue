<template>
  <div class="bill-log">
    <el-dialog :visible.sync="dialog" title="账单" center @close="close">
      <el-table :data="billData" border>
        <el-table-column prop="dividedNum" label="账期">
          <template slot-scope="scope">
            <span v-if="scope.row.dividedNum">第{{ scope.row.dividedNum }}期</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedTime" label="账期时间"/>
        <el-table-column label="应付金额">
          <template slot-scope="scope">
            <span>{{ scope.row.payAmountYuan + '$' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
            <span v-if="scope.row.balanceEnable">、余额</span>
          </template>
        </el-table-column>
        <el-table-column label="使用余额" prop="balanceMoneyYuan"/>
        <el-table-column prop="outTradeNo" label="支付单号"/>
        <el-table-column prop="tradeNo" label="第三方交易流水号"/>
        <el-table-column prop="payTime" label="实际支付时间"/>
        <el-table-column label="逾期天数" prop="delayTime">
          <template slot-scope="scope">
            <span>{{ scope.row.delayTime }}天</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusDes" label="返回信息"/>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="payLog(scope.row)">支付日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 支付日志弹窗 -->
    <el-dialog :visible.sync="payDialog" title="支付日志" center>
      <el-table :data="payInfo" border>
        <el-table-column label="支付时间" prop="gmtCreated"/>
        <el-table-column label="支付状态" prop="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status | payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因" prop="statusDes"/>
        <el-table-column label="备注" prop="remark"/>
      </el-table>
      <div slot="footer">
        <el-button type="info" @click="closePayDialog()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import billApi from '@/api/order/bill.js'
export default {
  components: {},
  props: {
    data: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      billData: [],
      dialog: false,
      no: '',
      payDialog: false,
      payInfo: []
    }
  },
  watch: {
    data: {
      handler(val) {
        this.no = val;
        if (val) {
          this.getBill(val);
        }
      }
    },
    show: {
      handler(val) {
        this.dialog = val;
      }
    }
  },
  methods: {
    getBill(no) {
      billApi.orderBill(no).then(res => {
        this.billData = res.data;
      })
    },
    close() {
      this.$emit('close');
    },
    // 查看支付日志
    payLog(row) {
      this.payDialog = true;
      // if (this.origin === 'parent') {
      billApi.orderPayLog(row.id).then(res => {
        if (res.code === 200) {
          this.payInfo = res.data;
        }
      })
      // } else if (this.origin === 'child') {
      //   billApi.childPayLog(row.id).then(res => {
      //     if (res.code === 200) {
      //       this.payInfo = res.data;
      //     }
      //   })
      // }
    },
    // 关闭支付日志弹窗
    closePayDialog() {
      this.payDialog = false;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
