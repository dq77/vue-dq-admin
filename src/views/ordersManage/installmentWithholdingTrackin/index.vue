<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 16:26:57
 * @LastEditors: your name
 * @LastEditTime: 2019-01-17 15:54:40
 -->
<template>
  <div class="stage-container">
    <div class="search-content">
      <el-form :model="query" :inline="true" label-width="100px">
        <el-form-item label="状态" class="risk-status-container">
          <el-radio-group v-model="query.billStatus" class="risk-status-tab" @change="getList">
            <el-radio-button :label="2">逾期中（{{ count[0] }}）</el-radio-button>
            <el-radio-button :label="0">正常分期还款中（{{ count[1] }}）</el-radio-button>
            <el-radio-button :label="1">已完成（{{ count[2] }}）</el-radio-button>
            <el-radio-button :label="3">已关闭（{{ count[3] }}）</el-radio-button>
            <el-radio-button :label="4">坏账（{{ count[4] }}）</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="query.channel" clearable>
            <el-option value="" label="全部"/>
            <el-option v-for="item in channelList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="query.billStatus !== 2 && query.billStatus !== 4" label="逾期记录">
          <el-select v-model="query.billHistoryFlag" clearable>
            <el-option :value="1" label="有"/>
            <el-option value="" label="无"/>
          </el-select>
        </el-form-item>
        <el-form-item label="买家信息">
          <el-input v-model="query.userKeyWord" placeholder="买家信息搜索" clearable/>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="query.receiverKeyWord" placeholder="收件人信息搜索"/>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="query.orderNo" clearable placeholder="请输入订单编号进行查询"/>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="query.productKeyWord" clearable placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker
            v-model="timeArr"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="timeList"
            :default-time="['00:00:00','23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"/>
        </el-form-item>
        <div class="search-btn">
          <el-button icon="el-icon-search" type="primary" @click="search()">查询</el-button>
          <!-- <el-button icon="el-icon-search" type="primary" @click="exportOrder()" :loading="exporting">导出{{exporting?'中':''}}</el-button> -->
        </div>
      </el-form>
    </div>
    <div class="stage-content">

      <el-table :data="orderData" border max-height="500">

        <el-table-column label="订单编号" width="150px">
          <template slot-scope="scope">
            <a href="javascript:;" class="a-color" @click="toDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</a>
          </template>
        </el-table-column>
        <el-table-column v-if="query.billStatus ===2 || query.billStatus === 4" label="逾期开始日期" prop="overDueTime" min-width="120px" align="center"/>
        <el-table-column label="下单时间" prop="createTime" min-width="100px" align="center"/>
        <el-table-column label="商品名称" align="center" min-width="200px" class-name="merge">
          <template v-if="scope.row.orderDetailVos" slot-scope="scope">
            <div v-for="(item,index) in scope.row.orderDetailVos" :key="index">
              <img :src="item.productInfo.cover" alt="商品图片" style="width: 40px; height: 40px">
              <ul>
                <el-tooltip :content="item.productInfo.name" class="item" effect="light" placement="top-end">
                  <li>{{ item.productInfo.name }}</li>
                </el-tooltip>
                <el-tooltip :content="item.productInfo.brief" effect="light" placement="top-end">
                  <li>{{ item.productInfo.brief }}</li>
                </el-tooltip>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" align="center">
          <template slot-scope="scope">
            <div v-for="(no,index) in scope.row.orderDetailVos" :key="index">
              {{ no.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeType | orderType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channel | channelFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.orderDetailVos" :key="item.oid">{{ item.totalRent + '$' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="应付金额" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.orderDetailVos" :key="item.oid">{{ item.payableAmount + '$' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="实收金额" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.orderDetailVos" :key="item.oid">{{ item.paidAmount + '$' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="月租金" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.orderDetailVos" :key="item.oid">{{ item.periodAmount + '$' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="租期" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.orderDetailVos" :key="item.oid">{{ item.period }}{{ item.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已付账期/应付账期" min-width="150px" align="center">
          <template slot-scope="scope">
            <div
              v-for="(good, index) in scope.row.orderDetailVos"
              :key="index"
            >
              <span class="text-active">{{ good.paidCount || 0 }}</span><span class="total-bill">{{ '/'+ good.billCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已付押金/剩余预授冻结金额" min-width="200px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.restDeposit + "$" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失败原因" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.failReason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" align="center" min-width="200px">
          <template slot-scope="scope">
            <ul class="address">
              <li>
                <span>{{ scope.row.receiverName }}  </span>
                <span>{{ scope.row.receiverMobile }}</span>
              </li>
              <el-tooltip :content="scope.row.receiverProvince+scope.row.receiverCity+scope.row.receiverDistrict+scope.row.receiverDetailAddress" class="item" effect="light" placement="top-end">
                <li>{{ scope.row.receiverProvince }}{{ scope.row.receiverCity }}{{ scope.row.receiverDistrict }}{{ scope.row.receiverDetailAddress }}</li>
              </el-tooltip>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="账单状态" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button type="text" @click="viewBill(scope.row)">
              <span v-if="scope.row.billStatus === 0" style="color: #EEB562">正常分期还款中</span>
              <span v-if="scope.row.billStatus === 1" style="color: #85ce61">已完成</span>
              <span v-if="scope.row.billStatus === 2" style="color: #f56c6c">有逾期</span>
              <span v-if="scope.row.billStatus === 3" style="color: #f56c6c">已取消</span>
              <span v-if="scope.row.billStatus === 4" style="color: #f56c6c">坏账</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="客服备注" min-width="200px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.sellerRemark && scope.row.sellerRemark[0]" :content="scope.row.sellerRemark[0].content" effect="light" placement="top-start">
              <a v-if="scope.row.sellerRemark" href="javascript:;" class="remark" @click="viewRemark(scope.row)">{{ scope.row.sellerRemark[0].content }}</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="info" plain icon="el-icon-edit" @click="addRemark(scope.row)">备注</el-button>
            <el-button type="success" plain icon="el-icon-document" @click="viewBill(scope.row)">账单</el-button>
            <el-button v-if="scope.row.billStatus === 2" type="warning" plain icon="el-icon-remove" @click="deadOrder(scope.row)">置为坏账</el-button>
            <el-button v-if="scope.row.billStatus === 4" type="primary" plain icon="el-icon-refresh" @click="resetDeadOrder(scope.row)">重置为非坏账</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
      </div>
      <bill-log :show="billDialog" :data-source="orderNo" @close="close"/>
      <zwq-remark :show="remarkDialog" @handOk="handSuccess" @handCancel="handClose"/>
      <dead-order :show="deadDialog" :data-source="deadOrderObj" @handClose="closeDeadDialog"/>
      <remark-show :show="customerDialog" :data-source="remarkData" @handClose="closeRemark"/>
    </div>
  </div>
</template>
<script>
import goodsApi from '@/api/goods.js';
import pagination from '../../../components/Pagination'
import orderApi from '@/api/order/order.js'
import billLog from './component/billLog'
import zwqRemark from '../returnManagement/returnOrdersDetail/modal/remark'
import { saveParameter } from '@/utils/saveParameter.js'
import deadOrder from '../dueAndReturnTracking/componet/deadOrder'
import dueApi from '@/api/order/due.js'
import remarkShow from '../components/remark_show'
import exportExcel from '../../../utils/xlsx.js'
import { orderType, channelFilter } from '../../../filters'
export default {
  components: {
    pagination,
    'bill-log': billLog,
    'zwq-remark': zwqRemark,
    'dead-order': deadOrder,
    'remark-show': remarkShow
  },
  data() {
    return {
      count: [0, 0, 0, 0, 0], // 数量统计
      deadDialog: false, // 置为坏账弹窗
      deadOrderObj: {}, // 坏账弹窗数据
      customerDialog: false, // 查看备注弹窗
      exporting: false, // 导出中
      remarkData: [], // 查看备注弹窗数据
      query: {
        channel: '',
        billStatus: 2,
        billHistoryFlag: '',
        receiverKeyWord: ''
      },
      searchData: {
        channel: '',
        billStatus: 2,
        billHistoryFlag: '',
        receiverKeyWord: ''
      },
      orderNo: '',
      billDialog: false,
      total: 0,
      remarkDialog: false, // 添加备注弹窗
      channelList: [],
      timeArr: [], // 逾期时间
      timeList: [], // 下单时间
      orderData: [],
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    expireStartTime() {
      return this.timeArr ? this.timeArr[0] : '';
    },
    expireEndTime() {
      return this.timeArr ? this.timeArr[1] : '';
    },
    startTime() {
      return this.timeList ? this.timeList[0] : '';
    },
    endTime() {
      return this.timeList ? this.timeList[1] : '';
    }
  },
  created() {
    this.getChannel();
    this.withholdingAmtCount();
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.searchData = {
        ...parameter
      };
      this.query = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      }
      this.timeList = [parameter.startTime, parameter.endTime];
    }
    this.getList();
  },
  methods: {

    // 数量统计
    withholdingAmtCount() {
      orderApi.WithholdingAmt().then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            switch (item.status * 1) {
              case 2:
                this.$set(this.count, 0, item.num);
                return;
              case 0:
                this.$set(this.count, 1, item.num);
                return;
              case 1:
                this.$set(this.count, 2, item.num);
                return;
              case 3:
                this.$set(this.count, 3, item.num);
                return;
              case 4:
                this.$set(this.count, 4, item.num);
                return;
            }
          })
        }
      })
    },

    // 查询
    search() {
      this.listQuery = {
        page: 1,
        pageSize: 10
      }
      this.searchData = {
        ...this.query,
        expireStartTime: this.expireStartTime,
        expireEndTime: this.expireEndTime,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.getList();
    },
    // 获取列表数据
    getList() {
      const data = {
        tableEnum: 'BILL_TABLE',
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        ...this.searchData,
        billStatus: this.query.billStatus,
        billHistoryFlag: this.query.billStatus === 2 || this.query.billStatus === 4 ? null : this.searchData.billHistoryFlag
      };
      orderApi.orderList(data).then(res => {
        if (res.code === 200) {
          this.orderData = res.data.list;
          this.total = res.data.totalRecords;

          sessionStorage.removeItem('pageFlag');
          this.listQuery.page = res.data.page;
          this.listQuery.pageSize = res.data.pageSize;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 获取渠道下拉框
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        }
      })
    },
    getTime(value) {
      this.query.startTime = value ? value[0] : '';
      this.query.endTime = value ? value[1] : '';
    },
    // 查看备注
    viewRemark(row) {
      this.customerDialog = true;
      this.remarkData = row.sellerRemark;
    },

    // 关闭查看备注弹窗
    closeRemark() {
      this.customerDialog = false;
    },
    // 添加备注
    addRemark(row) {
      this.remarkDialog = true;
      this.orderNo = row.orderNo;
    },
    // 提交备注
    handSuccess(val) {
      orderApi.addRemark({ orderNo: this.orderNo, remark: '【代扣跟踪备注】' + val }).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      })
      this.remarkDialog = false;
    },
    // 关闭备注弹窗
    handClose() {
      this.remarkDialog = false;
    },
    toDetail(no) {
      saveParameter(this.$route.path, JSON.stringify(this.searchData), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: no
        }
      })
    },
    viewBill(row) {
      this.orderNo = row.orderNo;
      this.billDialog = true;
    },
    close() {
      this.billDialog = false;
    },

    // 打开坏账弹窗
    deadOrder(row) {
      this.deadDialog = true;
      this.deadOrderObj = { ...row }
    },

    // 重置坏帐
    resetDeadOrder(row) {
      this.$confirm('确认重置为非坏账, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dueApi.resetDeadOrder({ orderNo: row.orderNo }).then(res => {
          if (res.code === 200) {
            this.$message.success('重置成功');
            this.getList();
            this.withholdingAmtCount();
          } else {
            this.$message.info(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 关闭坏账弹窗
    closeDeadDialog(val) {
      if (val.dialog) {
        // val.dialog为true时，表示子组件需要传递数据进行请求接口
        this.setDebts(val);
      } else {
        this.deadDialog = false
      }
    },
    billStatusFilter(val) {
      switch (val) {
        case 0:
          return '正常分期还款中';
        case 1:
          return '已完成';
        case 2:
          return '有逾期';
        case 3:
          return '已取消';
        case 4:
          return '坏账';
      }
    },
    // 订单导出
    exportOrder() {
      this.searchData = {
        ...this.query,
        expireStartTime: this.expireStartTime,
        expireEndTime: this.expireEndTime,
        startTime: this.startTime,
        endTime: this.endTime
      }
      const data = {
        tableEnum: 'BILL_TABLE',
        ...this.searchData,
        page: 1,
        pageSize: this.total,
        billStatus: this.query.billStatus,
        billHistoryFlag: this.query.billStatus === 2 || this.query.billStatus === 4 ? null : this.searchData.billHistoryFlag
      };
      this.exporting = true
      orderApi.orderList(data).then(res => {
        this.exporting = false
        if (res.code === 200) {
          const json = res.data.list.map(item => {
            const orderDtl = item.orderDetailVos[0]
            return {
              '订单编号': item.orderNo,
              '下单时间': item.createTime,
              '商品名称': orderDtl.productInfo.name,
              '商品数量': orderDtl.count,
              '订单类型': orderType(item.tradeType),
              '渠道': channelFilter(item.channel),
              '订单金额': orderDtl.totalRent + '$',
              '应付金额': orderDtl.payableAmount + '$',
              '实收金额': orderDtl.paidAmount + '$',
              '月租金': orderDtl.periodAmount + '$',
              '租期': orderDtl.period + orderDtl.unit,
              '已付账期/应付账期': orderDtl.paidCount + '/' + orderDtl.billCount,
              '已付押金/剩余预授冻结金额': item.restDeposit + '$',
              '失败原因': item.failReason || '',
              '收货地址': item.receiverProvince + item.receiverCity + item.receiverDistrict + item.receiverDetailAddress + ' ' + item.receiverName + item.receiverMobile,
              '账单状态': this.billStatusFilter(item.billStatus),
              '客服备注': (item.sellerRemark ? item.sellerRemark[0].content : '')
            }
          })
          // 好累啊写这个数据
          exportExcel(json, `订单${new Date().Format('yyyyMMdd')}.xlsx`)
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 置为坏账数据拿到父组件提交
    setDebts(val) {
      const data = {
        orderNo: this.deadOrderObj.orderNo,
        remark: '【代扣坏账备注】' + val.remark
      }
      dueApi.setBillDebts(data).then(res => {
        if (res.code === 200) {
          this.deadDialog = false;
          this.$message.success('已置为坏账');
          this.getList();
          this.withholdingAmtCount();
        } else {
          this.$message.info(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.stage-container {
  margin: 20px;
  .search-content {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 15px;

    .risk-status-container {
      display: block;
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .stage-content {
    padding: 15px;
    background-color: #fff;
  }
  .search-radio {
    margin-bottom: 10px;
  }
  .address {
    white-space: nowrap;
    overflow: hidden;
    li {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .remark {
    color: #2593FC;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
.stage-container  {
  .merge {
    padding: 0;
    .cell {
      padding: 5px;
      div {
        display: flex;
        ul {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-align: left;
          margin-left: 8px;
        }
        ul li {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        ul li:last-child {
          color: #969696;
        }
      }
    }
  }

  .risk-status-tab {
      .el-radio-button {
        margin-right: 10px;
        .el-radio-button__inner {
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          box-shadow: none;
        }
      }
    }
}
</style>

