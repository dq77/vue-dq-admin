<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 16:26:57
 * @LastEditors: your name
 * @LastEditTime: 2019-02-28 19:51:52
 -->
<template>
  <div class="pageContent">
    <div class="backBtn">
      <el-button icon="el-icon-back" type="primary" @click="goBack">返回</el-button>
      <div>
        <el-button icon="el-icon-edit-outline" type="primary" @click="addRemark()">备注</el-button>
        <el-button v-if="orderObj.refundStatus === 10111 && role === 'customer' && orderObj.createType !== 'RISK_REFUND'" icon="el-icon-sold-out" type="primary" @click="refundClose()">取消退货</el-button>
        <el-button v-if="orderObj.refundStatus === 10111 && role === 'customer'" icon="el-icon-sold-out" type="primary" @click="openFinacial()">提交财务审核</el-button>
        <el-button v-if="orderObj.refundStatus === 10111 && role === 'customer' && orderObj.refundType === 'REFUND_GOODS'" icon="el-icon-edit-outline" type="primary" @click="expressInfo()">完善物流信息</el-button>
        <el-button v-if="orderObj.refundStatus === 10111 && role === 'customer'" icon="el-icon-document" type="primary" @click="updateMoney()">完善退收款信息</el-button>
        <el-button v-if="0 && orderObj.refundStatus === 10111 && orderObj.returnStatus !== 10118 && role === 'store'" icon="el-icon-date" type="primary" @click="rcconfirm">回仓确认</el-button>
        <!-- <el-button v-if="orderObj.poundageStatus === 10119 && orderObj.refundStatus === 10113 && role === 'financial'" icon="el-icon-document" type="primary" @click="confirmMoney()">退收款确认</el-button> -->
        <el-button v-if="orderObj.refundStatus === 10112 && role === 'financial'" icon="el-icon-sold-out" type="primary" @click="approval()">审核</el-button>
      </div>
    </div>
    <div class="main">
      <el-card shadow="hover" class="Card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <span class="backok">{{ orderObj.refundStatus | refundStatus }}</span>
        </div>
        <div>
          <table v-loading="false" class="table">
            <tr>
              <td class="table-td-bgcolor">退货单号</td>
              <td>{{ orderObj.refundNo }}</td>
              <td class="table-td-bgcolor">原订单号</td>
              <td>{{ orderObj.tid }}</td>
              <td class="table-td-bgcolor">退货时间</td>
              <td>{{ orderObj.createTime }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">退货商品</td>
              <td>{{ orderObj.skuContent }}</td>
              <td class="table-td-bgcolor">退货数量</td>
              <td>{{ orderObj.refundCount }}</td>
              <td class="table-td-bgcolor">退货类型</td>
              <td>
                <span v-if="orderObj.refundType==='REFUND_ONLY'">无货品回仓</span>
                <span v-if="orderObj.refundType === 'REFUND_GOODS'">需货品回仓</span>
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">退货原因</td>
              <td>{{ orderObj.refundReason }}</td>
              <td class="table-td-bgcolor">是否已发货</td>
              <td>
                <span v-if="orderObj.returnStatus === 10116">待完善</span>
                <span v-if="orderObj.returnStatus === 10117 || orderObj.returnStatus === 10118">已发货</span>
              </td>
              <td class="table-td-bgcolor">退回物流</td>
              <td>
                <span v-if="orderObj.returnStatus && orderObj.returnStatus !== 10116">
                  {{ orderObj.expName }}--{{ orderObj.expCode }}
                </span>
                <span v-if="orderObj.returnStatus === 10116" style="color: #F57C00">待完善</span>
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">是否已回仓</td>
              <td>
                <span v-if="orderObj.returnStatus && orderObj.returnStatus !== 10118" style="color: #F57C00">待仓库确认</span>
                <span v-if="orderObj.returnStatus === 10118" style="color: #F57C00">已回仓</span>
              </td>
              <td class="table-td-bgcolor">总订单金额</td>
              <td>{{ orderObj.totalRent + '$' }}</td>
              <td class="table-td-bgcolor">总优惠</td>
              <td>{{ orderObj.discount + '$' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">应付金额</td>
              <td>{{ orderObj.orderPayableAmount + '$' }}</td>
              <td class="table-td-bgcolor">总押金</td>
              <td>{{ orderObj.totalDeposit + '$' }}</td>
              <td class="table-td-bgcolor">免押金额</td>
              <td>{{ orderObj.freeDeposit + '$' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">应付押金</td>
              <td>{{ orderObj.deposit + '$' }}</td>
              <!-- <td class="table-td-bgcolor">应退金额</td>
              <td>{{ orderObj.poundage + '$' }}</td> -->
              <td class="table-td-bgcolor">已解冻押金</td>
              <td>{{ orderObj.refundDeposit + '$' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">支付方式</td>
              <td>{{ orderObj.payChannel | payChannel }}</td>
              <td v-if="orderObj.payChannel === 'ALIPAY_AUTH'" class="table-td-bgcolor">预授金额</td>
              <td v-else-if="orderObj.payChannel === 'JD_PERIODIC' || orderObj.payChannel === 'JD_H5' " class="table-td-bgcolor">已支付押金</td>
              <td v-else class="table-td-bgcolor">已冻结押金</td>
              <td v-if="orderObj.payChannel !== 'ALIPAY_AUTH'">{{ orderObj.deposit + '$' }}</td>
              <td v-if="orderObj.payChannel === 'ALIPAY_AUTH'">{{ orderObj.deposit + orderObj.orderPayableAmount + '$' }}</td>
              <td class="table-td-bgcolor">已支付金额</td>
              <td>{{ orderObj.orderPaidAmount + '$' }}</td>

            </tr>
            <tr>
              <td class="table-td-bgcolor">退收款类型</td>
              <td>
                <span v-if="orderObj.poundageType === 'REFUND'">退款</span>
                <span v-if="orderObj.poundageType === 'RECIEVE'">收款</span>
              </td>
              <td v-if="orderObj.poundageType === 'REFUND'" class="table-td-bgcolor">退款</td>
              <td v-else-if="orderObj.poundageType === 'RECIEVE'" class="table-td-bgcolor">收款</td>
              <td v-else>退收款金额</td>
              <td>{{ orderObj.poundage + '$' }} <el-button v-if="orderObj.poundageStatus" type="text" @click="viewLog()">查看日志</el-button></td>
              <td class="table-td-bgcolor">已返现金额</td>
              <td>{{ orderObj.payBackMoney }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">财务审核结果</td>
              <td>
                <span v-if="orderObj.refundStatus ===10111 || orderObj.refundStatus ===10112">待审核</span>
              </td>
              <td class="table-td-bgcolor">客服备注</td>
              <td>
                <span v-if="orderObj.remark">{{ orderObj.remark[orderObj.remark.length-1].content }}</span>
                <el-button type="text" @click="viewRemark()">查看</el-button>
              </td>
            </tr>
          </table>
        </div>
      </el-card>
      <el-card shadow="hover" class="Card">
        <div slot="header" class="clearfix">
          <span>退货订单操作记录</span>
        </div>
        <div>
          <el-table
            :data="orderObj.operateLog"
            border
            stripe
            style="width: 100%"
            max-height="400"
          >
            <el-table-column
              prop="operateTime"
              label="时间"
              align="center"
            />
            <el-table-column
              prop="content"
              label="内容"
              align="center"
            />
            <el-table-column
              prop="username"
              align="center"
              label="操作人"/>
          </el-table>
        </div>
      </el-card>
    </div>
    <!-- 客服备注 -->
    <el-dialog
      v-if="customerDialog"
      :visible.sync="customerDialog"
      title="客服备注"
      center>
      <el-table :data="orderObj.remark" border>
        <el-table-column label="时间" prop="operateTime"/>
        <el-table-column label="内容" prop="content"/>
        <el-table-column label="操作人" prop="username"/>
      </el-table>
    </el-dialog>

    <!-- 客服提交财务审核 -->
    <el-dialog v-if="finacialDialog" :visible.sync="finacialDialog" title="提交财务审核" center>
      <el-row :gutter="20">
        <el-col :span="6" class="align-right">添加备注：</el-col>
        <el-col :span="16">
          <el-input v-model="finacialRemark" :rows="4" :maxlength="50" type="textarea" placeholder="请添加备注"/>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="info" @click="handClose(false)">取消</el-button>
        <el-button type="primary" @click="handClose(true)">确认</el-button>
      </div>
    </el-dialog>

    <!-- 财务审核 -->
    <el-dialog v-if="approvalDialog" :visible.sync="approvalDialog" title="审核" center>
      <el-form ref="formApproval" :model="formApproval" :rules="approvalRule" label-width="120px">
        <el-form-item label="审核结果：" prop="result">
          <el-radio-group v-model="formApproval.result">
            <el-radio-button label="驳回"/>
            <el-radio-button label="通过"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formApproval.result !== '通过'" label="驳回原因：" prop="message">
          <el-input v-model="formApproval.message" :rows="4" type="textarea" placeholder="建议填写备注说明情况"/>
        </el-form-item>
        <el-form-item v-if="formApproval.result === '通过'" label="温馨提示：">
          <span>通过后将会系统发起退款/扣款</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="approvalClose(false)">取消</el-button>
        <el-button type="primary" @click="approvalClose(true)">确认</el-button>
      </div>
    </el-dialog>

    <!-- 退收款完善 -->
    <return-money :dialog="returnMoneyDialog" :data-source="orderObj" @returnMoney="closeReturnMoney"/>
    <!-- 回仓确认 -->
    <returnconfirm :show="rcVisisble" :data-source="orderObj" @handOk="rcHandOk" @handCancel="rcHandCancel"/>
    <!-- 添加备注 -->
    <Remark :show="reVisible" @handOk="reHandOk" @handCancel="reHandCancel"/>
    <!-- 查看支付日志 -->
    <pay-info :pay-info-dialog="payDialog" :data-source="orderObj" @handClose="payClose"/>
    <!-- 退收款确认 -->
    <confirm-money :show="confirmDialog" :data-source="orderObj" @handOk="confirmOk" @handFalse="confirmFalse"/>
    <!-- 物流信息 -->
    <express-info :show="logisticsDialog" :data-source="orderObj" @handClose="expressClose"/>
  </div>
</template>
<script>
import compensationconfirm from './modal/compensationconfirm'
import returnconfirm from './modal/returnConfirm'
import Remark from './modal/remark'
import returnMoney from './modal/returnMoney'
import refundApi from '@/api/order/refund.js'
import orderApi from '@/api/order/order.js'
import billApi from '@/api/order/bill.js'
import payInfo from './modal/payInfo'
import confirmMoney from './modal/confirmMoney'
import expressInfo from '../../orderlist/components/expressInfo.vue'
export default {
  components: {
    compensationconfirm,
    returnconfirm,
    Remark,
    'pay-info': payInfo,
    'return-money': returnMoney,
    'confirm-money': confirmMoney,
    'express-info': expressInfo
  },
  data() {
    return {
      loading: null,
      rcVisisble: false,
      role: '', // 进入详情页的角色
      ccVisisble: false,
      reVisible: false,
      logisticsDialog: false,
      returnMoneyDialog: false, // 完善退收款弹窗
      payDialog: false, // 打开支付日志弹窗
      finacialDialog: false, // 提交财务审核弹窗
      finacialRemark: '', // 提交财务审核的备注
      confirmDialog: false, // 财务确认退收款弹窗
      approvalDialog: false, // 财务审核弹窗
      tableDataOne: {},
      tableDataTwo: [],
      orderObj: {
        sellerRemark: []
      }, // 退单信息
      formApproval: {
        result: '',
        message: ''
      },
      customerDialog: false, // 查看客服备注
      approvalRule: {
        result: [
          { reqiured: true, message: '请选择结果', trigger: 'blur' }
        ],
        message: [
          {
            reqiured: true, message: '请填写驳回理由', trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.role = sessionStorage.getItem('role');
    console.log('角色', this.role);
    this.getDetail(this.$route.query.refundNo);
    // this.opreationLog(this.$route.query.refundNo);
  },
  mounted() {

  },
  methods: {
    // 根据订单号查询详情
    getDetail(no) {
      refundApi.refundDetail({ refundNo: no }).then(res => {
        if (res.code === 200) {
          console.log('退货单详情信息', res);
          this.orderObj = res.data;
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    // 确认回仓提交
    rcHandOk(obj) {
      refundApi.confirmBack(obj).then(res => {
        if (res.code === 200) {
          this.rcVisisble = false;
          this.$message.success('确认回仓成功！');
          this.getDetail(this.$route.query.refundNo);
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    ccHandOk() {
      this.ccVisisble = false
    },
    rcHandCancel() {
      this.rcVisisble = false
    },
    ccHandCancel() {
      this.ccVisisble = false
    },
    // 添加备注
    reHandOk(value) {
      const data = {
        refundNo: this.orderObj.refundNo,
        message: value
      }
      refundApi.addRemark(data).then(res => {
        if (res.code === 200) {
          this.$message.success('添加备注成功！');
          this.getDetail(this.$route.query.refundNo);
          // this.opreationLog(this.$route.query.refundNo);
        } else {
          this.$message.info(res.msg);
        }
      })
      this.reVisible = false
    },
    reHandCancel() {
      this.reVisible = false
    },

    // 备注
    addRemark() {
      this.reVisible = true
    },
    // 查看备注
    viewRemark() {
      this.customerDialog = true;
    },
    // 回仓确认
    rcconfirm() {
      this.rcVisisble = true
    },
    // 退收款完善
    updateMoney() {
      this.returnMoneyDialog = true
    },
    // 退收款弹窗关闭
    closeReturnMoney(val) {
      if (val) {
        this.getDetail(this.$route.query.refundNo);
      }
      this.returnMoneyDialog = false;
    },
    // 撤销退货
    refundClose() {
      this.$confirm('此操作将会取消退单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          refundNo: this.orderObj.refundNo
        }
        orderApi.returnedClose(data).then(res => {
          if (res.code === 200) {
            this.$message.success('撤销退货成功！');
            this.getDetail(this.$route.query.refundNo);
          } else {
            this.$message.info(res.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '关闭撤销！'
        });
      });
    },
    // 提交财务审核
    openFinacial() {
      this.finacialDialog = true;
    },
    // 关闭提交财务弹窗
    handClose(val) {
      if (val) {
        const data = {
          refundNo: this.orderObj.refundNo,
          message: this.finacialRemark
        }
        this.submitFinacial(data);
      } else {
        this.finacialDialog = false;
        this.finacialRemark = '';
      }
    },
    // 提交财务审核
    submitFinacial(val) {
      refundApi.financialApproval(val).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功！');
          this.finacialDialog = false;
          this.getDetail(this.$route.query.refundNo);
          // this.opreationLog(this.$route.query.refundNo);
          this.finacialRemark = '';
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    viewLog() {
      this.payDialog = true;
    },
    payClose(val) {
      if (val) {
        this.getDetail(this.$route.query.refundNo);
        // this.opreationLog(this.$route.query.refundNo);
      } else {
        this.payDialog = false;
      }
    },
    approval() {
      this.approvalDialog = true;
    },
    // 财务审核结果提交
    approvalClose(val) {
      console.log('this.$refs[formApproval]：', this.$refs['formApproval']);
      this.$refs.formApproval.validate(valid => {
        if (valid) {
          this.approvalFunction(val)
        } else {
          return false
        }
      })
    },

    // 审批方法
    approvalFunction(val) {
      if (val) {
        this.loading = this.$loading({
          loack: true,
          text: '请求中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.formApproval.result === '驳回') {
          const data = {
            refundNo: this.orderObj.refundNo,
            message: this.formApproval.message
          }
          refundApi.approvalRefuse(data).then(res => {
            if (res.code === 200) {
              this.loading.close();
              this.$message.success('该订单已驳回！');
              this.getDetail(this.$route.query.refundNo);
              this.approvalDialog = false;
            } else {
              this.loading.close();
              this.$message.info(res.msg);
            }
          })
        } else if (this.formApproval.result === '通过') {
          const data = {
            refundNo: this.orderObj.refundNo,
            recordNo: this.orderObj.oid,
            amount: this.orderObj.poundage,
            forRefund: this.orderObj.poundageType !== 'RECIEVE' // true 退款  false 收款
          }
          billApi.payReturn(data).then(res => {
            this.$message.info(res.msg);
            this.loading.close();
            this.approvalDialog = false;
            this.getDetail(this.$route.query.refundNo);
          })
        }
      } else if (!val) {
        this.approvalDialog = false;
      }
    },
    // 财务确认退收款
    confirmMoney() {
      this.confirmDialog = true;
    },
    // 财务退收款确认
    confirmOk() {
      refundApi.confirmMoney({ refundNo: this.orderObj.refundNo }).then(res => {
        if (res.code === 200) {
          this.$message.success('确认成功！');
          this.getDetail(this.$route.query.refundNo);
          this.confirmDialog = false;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 取消退收款弹窗
    confirmFalse() {
      this.confirmDialog = false;
    },
    expressInfo() {
      this.$store.commit('SET_ORDER', this.orderObj);
      this.logisticsDialog = true;
    },
    // 关闭物流弹窗
    expressClose() {
      this.logisticsDialog = false;
      // this.getDetail(this.$route.query.refundNo);
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  flex: 1;
  overflow: auto;
}
.backBtn{
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
.table{
  width: 100%;
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  tr td:nth-of-type(1){
    width: 12%;
  }
  tr td:nth-of-type(3){
    width: 12%;
  }
  tr td:nth-of-type(5){
    width: 12%;
  }

}
.table-td-bgcolor{
  background: #FAFAFA;
}
.table tr td{
    border: 1px solid #ebeef5;
    text-align: center;
    height:36px;
    font-size: 12px;
    color: #606266;
    padding: 0 6px;
    box-sizing: border-box;
  }
.clearfix{
  border-left: 2px solid #2592FC;
  line-height: 16px;
  padding-left: 8px;
}
.Card{
  margin-bottom:16px;
}
.backok{
  margin-left: 30px;
  color:rgb(228, 149, 46)
}
.align-right {
  text-align: right;
}
</style>

