<template>
  <div class="rental-container">
    <div class="retal-search">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="状态" class="risk-status-container">
          <el-radio-group v-model="query.returnStatus" class="risk-status-tab" @change="getList">
            <el-radio-button :label="10051">租赁中({{ count[0] }})</el-radio-button>
            <el-radio-button :label="10061">待归还({{ count[1] }})</el-radio-button>
            <el-radio-button :label="10062">归还中({{ count[2] }})</el-radio-button>
            <el-radio-button :label="10064">已完成({{ count[3] }})</el-radio-button>
            <el-radio-button :label="10066">已续租({{ count[4] }})</el-radio-button>
            <el-radio-button :label="10067">已买断({{ count[5] }})</el-radio-button>
            <el-radio-button :label="10068">坏账({{ count[6] }})</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="query.orderNo" placeholder="请输入订单号" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="query.channel" placeholder="请选择渠道" class="input-200">
            <el-option value="" label="全部"/>
            <el-option value="ALIPAY_LIFE" label="支付宝生活号"/>
            <el-option value="APLIPAY_MINI_PROGRAM" label="支付宝小程序"/>
            <el-option value="APP" label="APP"/>
            <el-option value="DingDing" label="钉钉"/>
            <el-option value="FenXiao" label="微信分销"/>
            <el-option value="HuaBei" label="花呗"/>
            <el-option value="JDBT" label="京东白条"/>
            <el-option value="WeChat" label="微信小程序"/>
            <el-option value="BLUEAIR" label="BLUEAIR"/>
          </el-select>
        </el-form-item>
        <el-form-item label="买家信息">
          <el-input v-model="query.userKeyWord" placeholder="手机号、姓名" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="query.receiverKeyWord" placeholder="手机号、姓名" class="input-200"/>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="query.expressNo" placeholder="物流单号" clearable class="input-200"/>
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
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="业务模式">
          <el-select v-model="formData.businessTypes" clearable>
            <el-option value="" label="全部"/>
            <el-option :value="0" label="自营"/>
            <el-option :value="20" label="代租售"/>
          </el-select>
          <el-select v-model="formData.businessTypes" clearable>
            <el-option value="" label="全部"/>
            <el-option :value="0" label="支持代发货"/>
          </el-select>
          <el-input v-model="formData.labelCategoryName" class="input-180" placeholder="请输入代租售供应商名称" clearable/>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="search()">查询</el-button>
          <el-button type="primary" >
            <a href="javascript:;" target="_blank" @click="exportExcel()">导出</a>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="retal-table">
      <el-table :data="orderData" border max-height="600">
        <el-table-column label="订单编号" prop="no" min-width="150px" fixed="left" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" class="a-color" @click="ordersInfoForAll(scope.row)">{{ scope.row.orderNo }}</a>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" prop="finshTime" min-width="160" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li>{{ good.endTime }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="payTime" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="渠道" prop="channel" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channel | channelFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" class-name="good-table" min-width="200px" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.ordersProductInfo" :key="item.skuId" class="goods-name goods-brief">
              <img :src="item.cover" style="width:40px;height:40px">
              <ul>
                <el-tooltip :content="item.name" effect="light" placement="top-start">
                  <li>{{ item.name }}</li>
                </el-tooltip>
                <el-tooltip :content="item.brief" effect="light" placement="top-start">
                  <li>{{ item.brief }}</li>
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
        <el-table-column label="租金" prop="amountMonth" min-width="100" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li v-if="good.periodAmount">{{ good.periodAmount }}$/{{ good.unit }}</li>
                <li v-else>0</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="租期" prop="periodNumber" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li>
                  <span>{{ good.period }}</span>
                  <span v-if="good.unit === '月'">个</span>
                  <span v-if="good.unit">{{ good.unit }}</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分期/一次性" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | filters_payType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="amount" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li v-if="good.totalRent">{{ good.totalRent }}$</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="优惠" prop="discountAmount" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li>{{ good.apportionDiscount + '$' }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="应付金额" prop="payable" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li>{{ good.payableAmount + '$' }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已付金额" prop="payable" class-name="good-table" align="center">
          <template slot-scope="scope">
            <div v-for="(good, index) in scope.row.orderDetailVos" :key="index" class="goods-name">
              <ul>
                <li>{{ good.paidAmount + '$' }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已付押金/剩余预授冻结金额" prop="payable" min-width="150px" align="center" class-name="good-table">
          <template slot-scope="scope">
            <div>{{ scope.row.restDeposit }}$</div>
          </template>
        </el-table-column>

        <el-table-column label="订单状态" prop="status" align="center" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.status | orderStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="归还状态" align="center" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.returnStatus | orderStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="回仓时间" prop="backTime" align="center" min-width="200px"/>
        <!-- <el-table-column label="回仓仓库" prop="backTime" align="center"/> -->
        <el-table-column label="客服备注" align="center" min-width="250px">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.sellerRemark && scope.row.sellerRemark[0]" :content="scope.row.sellerRemark[0].content" class="item" effect="light" placement="top-start">
              <a v-if="scope.row.sellerRemark" href="javascript:;" class="remark" @click="viewRemark(scope.row)">{{ scope.row.sellerRemark[0].content }}</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="300" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.returnStatus === 10062 || scope.row.returnStatus === 10064" type="primary" @click="logistics(scope.row)">归还详情</el-button>
            <el-button v-if="0 && scope.row.returnStatus === 10062 " type="primary" @click="confirm(scope.row)">确认回仓</el-button>
            <el-button v-if="[10051, 10061, 10068].indexOf(scope.row.returnStatus) > -1" type="primary" @click="returned(scope.row)">
              <span v-if="scope.row.returnStatus === 10051">提前归还</span>
              <span v-if="scope.row.returnStatus === 10061 || scope.row.returnStatus === 10068">归还</span>
            </el-button>
            <el-button v-if="scope.row.returnStatus === 10061" type="warning" icon="el-icon-remove" @click="deadOrder(scope.row)">置为坏账</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    </div>
    <confirm :show="confirmDialog" :data-source="tempObj" @handOk="refresh" @handCose="closeConfirm"/>
    <return-detail :show="expressDialog" :data-source="tempObj" @handClose="closeExpress"/>
    <returned :show="returnedDialog" :data-source="returnedObj" @handClose="closeReturned"/>
    <dead-order :show="deadDialog" :data-source="deadOrderObj" @handClose="closeDeadDialog"/>
    <!-- 查看备注弹窗 -->
    <remark-show :show="remarkDialog" :data-source="remarkData" @handClose="closeRemark"/>
    <form ref="hiddenForm" :action="baseurl" method="post" style="display:none" target="targetIfr">
      <input ref="input">
    </form>
    <iframe name="targetIfr" style="display:none"/>
  </div>
</template>

<script>
import pagination from '../../../components/Pagination'
import orderApi from '@/api/order/order.js'
import confirm from './componet/confirm'
import returnDetail from './componet/returnDetail'
import { baseUrl } from '@/common/config.js'
import { saveParameter } from '@/utils/saveParameter.js'
import returned from './componet/returned'
import deadOrder from './componet/deadOrder'
import dueApi from '@/api/order/due.js'
import remarkShow from '../components/remark_show'
export default {
  components: {
    pagination,
    confirm,
    returned,
    'dead-order': deadOrder,
    'return-detail': returnDetail,
    'remark-show': remarkShow
  },
  filters: {
    // 付款类型过滤
    filters_payType(val) {
      switch (val) {
        case 1:
          return '一次性支付';
        case 2:
          return '分期支付';
        case 3:
          return '分期支付';
        case 4:
          return '一次性支付';
        case 5:
          return '分期支付';
        case 6:
          return '一次性支付';
        default:
          break;
      }
    }
  },
  data() {
    return {
      baseurl: `${baseUrl}/orders/export_lease_order`,
      listQuery: {
        limit: 10,
        page: 1
      },
      remarkDialog: false, // 查看备注弹窗
      remarkData: [], // 查看备注弹窗数据
      tempObj: {},
      query: {
        returnStatus: 10051,
        orderNo: '',
        expressNo: '',
        channel: '',
        userKeyWord: '',
        receiverKeyWord: '',
        startTime: '',
        endTime: '',
        expireStartTime: '',
        expireEndTime: ''
      },
      tempSearch: {
        returnStatus: 10051,
        channel: '',
        orderNo: '',
        expressNo: '',
        channel: '',
        userKeyWord: '',
        receiverKeyWord: '',
        startTime: '',
        endTime: '',
        expireStartTime: '',
        expireEndTime: ''
      }, // 查询条件中间存储
      confirmDialog: false, // 确认收货弹窗
      returnedDialog: false, // 归还弹窗
      returnedObj: {}, // 归还弹窗数据
      deadOrderObj: {}, // 坏账弹窗数据
      deadDialog: false, // 坏账弹窗
      expressDialog: false, // 归还详情弹窗
      total: 0,
      timeArr: [], // 到期时间范围
      timeList: [], // 下单时间范围
      no: '',
      orderData: [],
      count: [0, 0, 0, 0, 0, 0, 0]
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
    this.getCount();
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.query = {
        ...parameter
      };
      this.tempSearch = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      };
      this.timeArr = [parameter.expireStartTime, parameter.expireEndTime];
      this.timeList = [parameter.startTime, parameter.endTime];
    }
    this.getList();
  },
  methods: {
    // 订单统计
    getCount() {
      dueApi.dueCount().then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            switch (item.status * 1) {
              case 10051:
                this.$set(this.count, 0, item.num);
                return
              case 10061:
                this.$set(this.count, 1, item.num);
                return
              case 10062:
                this.$set(this.count, 2, item.num);
                return
              case 10064:
                this.$set(this.count, 3, item.num);
                return
              case 10066:
                this.$set(this.count, 4, item.num);
                return
              case 10067:
                this.$set(this.count, 5, item.num);
                return
              case 10068:
                this.$set(this.count, 6, item.num);
                return
            }
          })
        }
      })
    },
    ordersInfoForAll(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: row.orderNo
        }
      })
    },
    // 获取列表
    getList() {
      const data = {
        tableEnum: 'RENT_BACK',
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...this.tempSearch,
        returnStatus: this.query.returnStatus
      }
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
    confirm(row) {
      this.confirmDialog = true;
      this.tempObj = row;
    },
    logistics(row) {
      this.expressDialog = true;
      this.tempObj = row;
    },
    // 关闭确认收货弹窗
    closeConfirm(val) {
      this.confirmDialog = false;
    },

    // 查看备注弹窗
    viewRemark(row) {
      this.remarkDialog = true;
      this.remarkData = row.sellerRemark;
    },
    // 关闭备注弹窗
    closeRemark() {
      this.remarkDialog = false;
    },
    // 归还操作
    returned(row) {
      this.returnedDialog = true;
      this.returnedObj = { ...row };
    },

    // 关闭归还弹窗
    closeReturned(val) {
      if (val) {
        this.getList();
        this.getCount();
      }
      this.returnedDialog = false;
    },
    // 置为坏账
    deadOrder(row) {
      this.deadDialog = true;
      this.deadOrderObj = { ...row };
    },

    // 关闭坏账弹窗
    closeDeadDialog(val) {
      if (val.dialog) {
        // 当子组件传的dialog为true时，则是提交数据
        this.setDebts(val)
      } else {
        this.deadDialog = false;
      }
    },
    // 置为坏账的数据拿到父组件提交
    setDebts(val) {
      console.log('val', val);
      const data = {
        oid: this.deadOrderObj.orderDetailVos && this.deadOrderObj.orderDetailVos[0] ? this.deadOrderObj.orderDetailVos[0].oid : '',
        remark: '【到期归还坏账】' + val.remark
      }
      dueApi.setDebts(data).then(res => {
        if (res.code === 200) {
          this.deadDialog = false;
          this.$message.success('已置为坏账');
          this.getList();
          this.getCount();
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    // 确认收货之后刷新列表
    refresh() {
      this.getList();
      this.getCount();
      this.confirmDialog = false;
    },
    // 关闭物流弹窗
    closeExpress() {
      this.expressDialog = false;
    },
    // 条件查询
    search() {
      this.page = 1;
      this.pageSize = 10;
      this.tempSearch = {
        ...this.query,
        expireStartTime: this.expireStartTime,
        expireEndTime: this.expireEndTime,
        startTime: this.startTime,
        endTime: this.endTime
      }
      // this.tempSearch.statusList = this.tempSearch.statusList ? this.tempSearch.statusList : [10051,10060,10065];
      // 当点击查询的时候才将查询栏的值赋值到列表参数中
      this.getList();
    },
    // 导出
    exportExcel() {
      const data = {
        returnStatus: this.query.returnStatus || null,
        orderNo: this.no || null,
        expressNo: this.query.expressNo || null,
        productKeyWord: this.query.productKeyWord || null,
        expireStartTime: this.expireStartTime || null,
        expireEndTime: this.expireEndTime || null,
        startTime: this.startTime || null,
        endTime: this.endTime || null,
        returnStatus: this.query.returnStatus || null,
        channel: this.query.channel || null
      }
      var form = this.$refs['hiddenForm'];
      var input = this.$refs['input'];
      input.type = 'hidden';
      input.name = 'ordersQueryStr';
      input.value = JSON.stringify(data);
      form.submit();
    },
    // 页码切换
    handleSizeChange(value) {
      this.pageSize = value;
      this.getList();
    },
    // 当前页切换
    handleCurrentChange(value) {
      this.page = value;
      this.getList();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .rental-container {
    margin: 20px;
    .retal-search {
      padding: 10px;
      margin-bottom: 15px;
      background-color: #fff;

      .risk-status-container {
        display: block;
      }
    }
    .retal-table {
      padding: 15px;
      background-color: #fff;
       .search-radio{
        margin-bottom: 10px;
      }
    }
    .btn-save {
      text-align: center;
    }
   .logistics-content {
     height: 500px;
     overflow: auto;
      margin-top: 10px;
      background-color: #ffffff;
      padding-top:18px;
      padding-bottom: 15px;
      .logistics-info {
        display: flex;
        align-items: center;

      .info-time {
        width: 24%;
        // height: 100%;
        display: inline-block;
        padding: 5px 20px 5px 0;
        text-align: right;

        position: relative;
        .small-circle {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background:#EEEEEE;
          position: absolute;
          right: -4px;
          top: 35px;
        }
        .activeCircle {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background-color: #1CCFC9;
          position: absolute;
          right: -6px;
          top: 35px;
        }
        .time {
          font-size: 14px;
          color: #999999;
          letter-spacing: 0;
          height: 20px;
        }
        .date {
          font-size: 11px;
          color: #999999;
          letter-spacing: 0;
          height: 15px;
        }
        .timeActive {
          font-size: 16px;
          color: #666666;
          letter-spacing: 0;
          line-height: 16px;
          margin-bottom: 5px;
        }
        .dateActive {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
          line-height: 12px;
        }
      }
      .info-address {
        width: 73%;
        min-height: 85px;
        height: auto;
        padding:18px 21px 18px 20px;
        border-left: 2px solid #EEEEEE;
        vertical-align: middle;
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #999999;
        letter-spacing: 0;
        line-height: 20px;
        text-align: left;

      }
      .activeStatus {
        font-size: 14px;
        color: #222222;
        letter-spacing: 0;
        line-height: 20px;
        padding-top: 0;
      }
    }
    }
    .wdh-195 {
      width: 195px;
    }
    .wdh-100 {
      width:100%;
    }
    .expressDetail {
      min-height: 300px;
      width: 100%;
      text-align: center;
    }
    .block__style {
      background: #e0e0e0;
      padding: 10px;
      h3 {
        margin: 0;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
    .grid-content {
      padding: 10px 0;
      min-height: 36px;
    }
    .goods-name {
      display: flex;
      border-bottom: 1px solid #ebeef5;
      padding: 3px;
      ul {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        margin-left: 5px;
      }
      ul li {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .goods-brief {
      ul li:last-child {
        color: #9A9897;
      }
    }
    .cell div:last-child {
      border: 0;
    }
    .remark {
      color: #2593FC;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
<style lang="scss">
  .rental-container {
    .el-tabs__nav {
      margin-left: 20px;
    }
    .good-table {
      padding: 0;
      .cell {
        padding: 0;
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
