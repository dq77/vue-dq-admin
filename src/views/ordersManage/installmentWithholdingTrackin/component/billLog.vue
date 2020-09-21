<template>
  <div class="bill-log">
    <el-dialog :visible.sync="dialog" title="账单" width="1000px" center @close="close">
      <el-table :data="billData" border max-height="500">
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
        <el-table-column prop="responseDes" label="返回信息"/>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="payLog(scope.row)">支付日志</el-button>
            <el-button v-if=" scope.row.status === 1 || scope.row.status === 2" type="primary" plain @click="changeStatus(scope.row)">修改状态</el-button>
            <el-button v-if=" scope.row.status === 1 || scope.row.status === 2" type="primary" plain @click="payAgin(scope.row)">发起支付</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 支付日志弹窗 -->
    <el-dialog :visible.sync="payDialog" width="700px" title="支付日志" center>
      <el-table :data="payInfo" border>
        <el-table-column label="支付时间" prop="gmtCreated"/>
        <el-table-column label="支付渠道">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
            <span v-if="scope.row.balanceEnable">、余额</span>
          </template>
        </el-table-column>
        <el-table-column label="支付金额">
          <template slot-scope="scope">
            <span>{{ scope.row.amountYuan }}$</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | payStatus }}</span>
          </template>
        </el-table-column>

        <el-table-column label="支付接口返回信息" prop="responseDes"/>
        <el-table-column label="备注" prop="reason"/>
      </el-table>
      <div slot="footer">
        <el-button type="info" @click="closePayDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="statusDialog" title="修改账单状态" center>
      <el-form ref="billObj" :model="billObj" :rules="billObjRule" label-width="150px">
        <el-form-item label="账单状态：" prop="status">
          <el-select v-model="billObj.status">
            <el-option :value="0" label="已完成（线下转账）"/>
            <el-option :value="1" label="待支付"/>
            <el-option :value="3" disabled label="已关闭"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="billObj.remark" :rows="3" type="textarea" placeholder="请填写备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="closeStatus()">取消</el-button>
        <el-button type="primary" @click="submitStatus('billObj')">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import billApi from '@/api/order/bill.js'
export default {
  components: {},
  props: {
    dataSource: {
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
      payInfo: [],
      statusDialog: false,
      billObjRule: {
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      },
      billObj: {}
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        this.no = val;
      }
    },
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.getBill(this.dataSource);
        }
      }
    }
  },
  methods: {
    getBill(no) {
      billApi.orderBill(no).then(res => {
        if (res.code === 200) {
          this.billData = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    close() {
      this.$emit('close');
    },
    // 查看支付日志
    payLog(row) {
      this.payDialog = true;
      billApi.orderPayLog(row.id).then(res => {
        if (res.code === 200) {
          this.payInfo = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 关闭支付日志弹窗
    closePayDialog() {
      this.payDialog = false;
    },
    //  打开修改父账单状态弹窗
    changeStatus(row) {
      this.statusDialog = true;
      this.billObj = row;
    },
    // 提交修改父账单状态
    submitStatus(billObj) {
      this.$refs[billObj].validate(valid => {
        if (valid) {
          billApi.billStatus(this.billObj.id, { status: this.billObj.status, remark: this.billObj.remark }).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功！');
              this.statusDialog = false;
              this.getBill(this.dataSource);
              this.$refs['billObj'].resetFields();
            } else {
              this.$message.info(res.msg);
            }
          })
        } else {
          return false;
        }
      })
    },
    // 关闭修改状态弹窗
    closeStatus() {
      this.statusDialog = false;
      this.$refs['billObj'].resetFields();
    },
    // 父账单发起支付
    payAgin(row) {
      const loading = this.$loading({
        lock: true,
        text: '支付中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      billApi.payAgin(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('支付成功！');
          this.getBill(this.dataSource);
        } else {
          this.$message.info(res.msg);
        }
        loading.close();
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
