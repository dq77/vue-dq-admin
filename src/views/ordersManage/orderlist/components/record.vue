<template>
  <div class="record-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="1000px" @close="cancel">
      <template v-if="dataSource.payChannel === 'ALIPAY_AUTH' || dataSource.payChannel === 'HUA_BEI'">
        <el-card>
          <div slot="header" class="title">预授记录</div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="预授时间" prop="gmtCreate"/>
            <el-table-column label="预授金额">
              <template slot-scope="scope">
                <span>{{ scope.row.amount }}$</span>
              </template>
            </el-table-column>
            <el-table-column label="预授单号（商户单号）" prop="authNo"/>
            <el-table-column label="请求流水号" prop="outRequestNo"/>
            <el-table-column label="支付宝授权单号" prop="outOrderNo"/>
            <el-table-column label="支付宝操作流水号" prop="operationId"/>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="信用冻结/资金冻结">
              <template slot-scope="scope">
                <span>{{ scope.row.creditAmount }}/{{ scope.row.fundAmount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card>
          <div slot="header" class="title">解冻记录</div>
          <el-button v-if="tableData[0] && tableData[0].status === 1" type="primary" @click="termination()">手动解冻</el-button>
          <el-table :data="recordData" border style="width: 100%">
            <el-table-column label="解冻时间" prop="gmtUnfreeze"/>
            <el-table-column label="解冻金额" prop="unFreezeAmount"/>
            <el-table-column label="支付宝操作流水号" prop="tradeNo"/>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="解冻场景" prop="unfreezeScene"/>
            <el-table-column label="操作人" prop="operationUserName"/>
          </el-table>
        </el-card>
      </template>
      <template v-if="dataSource.payChannel === 'JD_PERIODIC' || dataSource.payChannel === 'JD_H5'">
        <el-card>
          <div slot="header" class="title">押金支付记录</div>
          <el-table :data="tableData" border>
            <el-table-column label="支付时间" prop="gmtCreate"/>
            <el-table-column label="押金" prop="amount"/>
            <el-table-column label="支付单号" prop="orderNo"/>
            <el-table-column label="第三方交易流水号" prop="tradeNo"/>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="返回信息" prop=""></el-table-column> -->
          </el-table>
          <div class="tip">*京东渠道的押金为支付到我方账户中，并且与下单时首期支付金额同一个交易流水号</div>
        </el-card>
        <el-card>
          <div slot="header" class="title">押金退还记录<el-button v-if="tableData[0] && tableData[0].status === 1" type="primary" @click="termination()">手动退还</el-button></div>
          <el-table :data="recordData" border>
            <el-table-column label="退还时间" prop="gmtUnfreeze"/>
            <el-table-column label="退回金额" prop="unFreezeAmount"/>
            <el-table-column label="退款单号" prop="refundNo"/>
            <el-table-column label="第三方交易流水号" prop="tradeNo"/>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="返回信息"></el-table-column> -->
            <el-table-column label="返还场景" prop="unfreezeScene"/>
            <el-table-column label="操作人" prop="operationUserName"/>
          </el-table>
        </el-card>
      </template>
      <template v-if="dataSource.payChannel === 'ALIPAY_AGREEMENT'">
        <el-card>
          <div slot="header" class="title">签约记录</div>
          <el-table :data="tableData" border>
            <el-table-column label="签约时间" prop="gmtCreate"/>
            <el-table-column label="商户签约号" prop="authNo"/>
            <el-table-column label="协议号"/>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card>
          <div slot="header" class="title">解约记录<el-button v-if="tableData[0] && tableData[0].status === 1" type="primary" @click="termination()">手动解约</el-button></div>
          <div>
            <el-table :data="recordData" border>
              <el-table-column label="解约时间" prop="gmtUnfreeze"/>
              <el-table-column label="状态" prop="status">
                <template slot-scope="scope">
                  <span>{{ scope.row.status | statusFilter }}</span>
                </template>
              </el-table-column>
              <el-table-column label="返回信息"/>
              <el-table-column label="解约场景" prop="unfreezeScene"/>
              <el-table-column label="操作人" prop="operationUserName"/>
            </el-table>
          </div>
        </el-card>
      </template>
      <template v-if="dataSource.payChannel === 'ALIPAY_ZM_FREE'">
        <el-card>
          <div slot="header" class="title">信用查看</div>
          <el-table :data="tableData" border>
            <el-table-column label="信用下单时间" prop="gmtCreate"/>
            <el-table-column label="冻结押金" prop=""/>
            <el-table-column label="冻结租金"/>
            <el-table-column label="芝麻订单号"/>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.status | statusFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card>
          <div slot="header" class="title">信用完结记录<el-button v-if="tableData[0] && tableData[0].status === 1" type="primary" @click="termination()">手动完结</el-button></div>
          <el-table :data="recordData" border>
            <el-table-column label="完结时间" prop="gmtUnfreeze"/>
            <el-table-column label="返回信息" prop="status"/>
            <el-table-column label="完结场景" prop="unfreezeScene"/>
            <el-table-column label="操作人" prop="operationUserName"/>
          </el-table>
        </el-card>
      </template>
    </el-dialog>
    <!-- 手动退还、解冻 -->
    <termination-contract :show="terminationShow" :data-source="contractData" @handClose="closeContract"/>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
import terminationContract from './terminationContract'
export default {
  components: {
    'termination-contract': terminationContract
  },
  filters: {
    statusFilter(val) {
      val *= 1;
      // if (val === 1) {
      //   return '有效'
      // } else if (val === 0) {
      //   return '有效'
      // }
      return '成功'
    }
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
    return {
      title: '',
      dialog: false,
      tableData: [], // 表格数据
      recordData: [], // 记录数据
      terminationShow: false, // 解约弹窗
      contractData: {} // 解约弹窗数据
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val
        if (val) {
          console.log('信息', this.dataSource);
          this.getAuthInfo(this.dataSource.orderNo);
          this.title = this.titleFilter(this.dataSource.payChannel)
        }
      }
    }
  },
  methods: {

    // 不同支付方式显示不同标题
    titleFilter(val) {
      switch (val) {
        case 'ALIPAY_AUTH':
          return '查看预授';
        case 'JD_PERIODIC':
          return '查看押金';
        case 'ALIPAY_AGREEMENT':
          return '信用查看';
        case 'HUA_BEI':
          return '查看预授'
      }
    },

    // 获取签约信息
    getAuthInfo(no) {
      this.tableData = [];
      orderApi.getAuthInfo(no).then(res => {
        if (res.code === 200) {
          this.tableData.push(res.data);
          this.getHistory(no);
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 获取历史解约信息
    getHistory(no) {
      orderApi.getContractHistory(no).then(res => {
        if (res.code === 200) {
          this.recordData = res.data;
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 手动解冻
    termination() {
      // 查询剩余押金/未解冻金额
      orderApi.getUnfreeze(this.dataSource.orderNo).then(res => {
        if (res.code === 200) {
          this.contractData = {
            ...this.dataSource,
            preUnfreezeAmount: res.data ? res.data.preUnfreezeAmount : 0
          };
          this.terminationShow = true;
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 关闭手动解冻弹窗
    closeContract(val, obj) {
      if (val) {
        // 解冻预授权
        const data = {
          needUnfreezeAmount: obj.needUnfreezeAmount,
          orderNo: this.dataSource.orderNo,
          remark: obj.remark
        }
        orderApi.terminationContract(data).then(res => {
          if (res.code === 200) {
            this.$message.success('解冻成功！');
            this.getAuthInfo(this.dataSource.orderNo);
            this.terminationShow = false;
          } else {
            this.$message.info(res.msg);
          }
        })
      } else {
        this.terminationShow = false;
      }
    },

    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .record-container {
    .title {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592FC;
      background-color: #f3f3f3;
    }
    .tip {
      color: #333333;
    }
    .el-card {
      margin-bottom: 20px;
    }
  }
</style>
