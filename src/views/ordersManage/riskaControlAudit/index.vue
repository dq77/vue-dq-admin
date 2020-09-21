<template>
  <div class="riska-container ">
    <div class="riska-search">
      <el-form :model="queryForm" :inline="true" label-width="100px">
        <el-form-item label="审核状态" class="risk-status-container">
          <el-radio-group v-model="queryForm.riskStatus" class="risk-status-tab" @change="selectStatus">
            <el-radio-button v-for="(item, index) in riskStatusList" :key="index" :label="item.value">{{ item.label }}({{ item.num }})</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品关键字">
          <el-input v-model="queryForm.productKeyWord" clearable placeholder="请输入商品名、spuNo"/>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model.trim="queryForm.orderNo" clearable placeholder="请输入订单号"/>
        </el-form-item>
        <el-form-item label="买家搜索">
          <el-input v-model="queryForm.userKeyWord" clearable class="input-174" placeholder="请输入买家姓名、手机号"/>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="queryForm.receiverKeyWord" clearable class="input-174" placeholder="请输入收件人姓名、手机号"/>
        </el-form-item>
        <el-form-item label="下单日期">
          <el-date-picker
            v-model="timeList"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"/>
        </el-form-item>
        <div class="search-btn">
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
          <el-button type="primary" icon="el-icon-document" @click="goRule()">风控规则</el-button>
        </div>
      </el-form>
    </div>
    <div class="riska-table">
      <div ref="tableContent" class="table-content">
        <el-table :data="riskaData" :max-height="600" border class="header-align">
          <el-table-column prop="orderNo" label="订单编号" width="150px" fixed="left" align="center">
            <template slot-scope="scope">
              <!-- <a href="javascript:;" type="text" @click="goOrderDetail(scope.row.orderNo)" class="a-color">{{ scope.row.orderNo }}</a> -->
              <!-- <el-button v-clipboard:copy="scope.row.orderNo" v-clipboard:success="clipboardSuccess" type="text" @click="copy()">copy</el-button> -->
              <span>{{ scope.row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道" prop="channel" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.channel | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeType === 'Lease'">租赁</span>
              <span v-if="scope.row.tradeType === 'Sales'">售卖</span>
              <span v-if="scope.row.tradeType === 'Renewal'">续租</span>
              <span v-if="scope.row.tradeType === 'Buyout'">买断</span>
              <span v-if="scope.row.tradeType === 'Staging'">Staging</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名" width="200px" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.ordersProductInfo" :key="item.skuId" class="goods-container">
                <el-popover
                  :width="200"
                  placement="top-start"
                  trigger="hover">
                  <img :src="item.cover" style="width:200px">
                  <img slot="reference" :src="item.cover">
                </el-popover>
                <div class="goods-name">
                  <ul>
                    <el-tooltip :content="item.name" class="item" effect="light" placement="top-start">
                      <li>{{ item.name }}</li>
                    </el-tooltip>
                    <el-tooltip :content="item.brief" class="item" effect="light" placement="top-start">
                      <li class="brief">规格：{{ item.detail }}</li>
                    </el-tooltip>
                  </ul>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.ordersProductInfo" :key="item.oid+index">{{ item.count }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" align="center">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                  {{ good.totalRent + '$' }}
                </li>
              </ul>
              <div v-else>{{ scope.row.totalRent + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="租期" align="center">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                  {{ good.period }}<span v-if="good.unit === '月'">个</span>{{ good.unit }}
                </li>
              </ul>
              <div v-else>{{ scope.row.period }}<span v-if="scope.row.unit === '月'">个</span>{{ scope.row.unit }}</div>
            </template>
          </el-table-column>
          <el-table-column label="分期(期)" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.orderDetailVos.length > 0">
                <div v-for="(item, index) in scope.row.orderDetailVos" :key="index">
                  <span v-if="scope.row.payType !== 1">{{ item.billCount }}</span>
                  <span v-else>/</span>
                </div>
              </div>
              <div v-else>/</div>
            </template>
          </el-table-column>
          <el-table-column label="已付金额" prop="paidAmount" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.orderDetailVos.length > 0">
                <div v-for="(item, index) in scope.row.orderDetailVos" :key="index">{{ item.paidAmount + '$' }}</div>
              </div>
              <div v-else>{{ scope.row.paidAmount + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="押金" align="center">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li
                  v-for="(good, index) in scope.row.orderDetailVos"
                  :key="index"
                >
                  {{ good.totalDeposit + '$' }}
                </li>
              </ul>
              <div v-else>{{ scope.row.totalDeposit + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="实付押金" align="center">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li
                  v-for="(good, index) in scope.row.orderDetailVos"
                  :key="index"
                >
                  {{ good.deposit + '$' }}
                </li>
              </ul>
              <div v-else>{{ scope.row.deposit + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="createTime" min-width="150px" align="center"/>
          <el-table-column label="用户信息" align="center" min-width="150px">
            <template slot-scope="scope">
              <div>{{ scope.row.username }}</div>
              <div>{{ scope.row.userMobile }}</div>
            </template>
          </el-table-column>
          <el-table-column label="收件信息" prop="username" align="center" min-width="200px">
            <template slot-scope="scope">
              <div>{{ scope.row.receiverName }}--{{ scope.row.receiverMobile }}</div>
              <span>{{ scope.row.receiverProvince }}</span>
              <span>{{ scope.row.receiverCity }}</span>
              <span>{{ scope.row.receiverDistrict }}</span>
              <span>{{ scope.row.receiverDetailAddress }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sellerRemark">{{ scope.row.sellerRemark[scope.row.sellerRemark.length-1].content }}</span>
              <el-button v-if="scope.row.sellerRemark && scope.row.sellerRemark.length > 0" type="text" @click="viewRemark(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="身份证号" prop="idCard" min-width="150px" align="center"/>
          <el-table-column label="审核状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.riskStatus | orderStatusFilter }}</div>
              <div v-if="scope.row.riskStatus == 10034">【{{ scope.row.refuseReason }}】</div>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.riskTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-view" type="primary" plain @click="riskaDetail(scope.row.orderNo)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    </div>
    <remark-dialog :show="remarkDialog" :data-source="remarkList" @closeDialog="closeRemark"/>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'
import pagination from '@/components/Pagination/index.vue'
import orderApi from '@/api/order/order.js'
import { saveParameter } from '@/utils/saveParameter.js'
import remarkDialog from './component/remark'
export default {
  components: {
    pagination,
    'remark-dialog': remarkDialog
  },
  directives: {
    clipboard
  },
  data() {
    return {
      remarkDialog: false, // 备注弹窗
      remarkList: [], // 备注数组
      riskStatusList: [
        {
          label: '待处理',
          value: 2,
          num: 0
        },
        {
          label: '处理中',
          value: 6,
          num: 0
        },
        {
          label: '审核通过',
          value: 1,
          num: 0
        },
        {
          label: '审核拒绝',
          value: 3,
          num: 0
        },
        {
          label: '系统自动拒绝',
          value: 4,
          num: 0
        },
        {
          label: '系统自动通过',
          value: 5,
          num: 0
        }
      ],
      count: [0, 0, 0, 0, 0],
      total: 0,
      editDialog: false,
      height: 500,
      searchData: {
        startTime: '',
        endTime: '',
        riskStatus: 2 // 审核状态
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      timeList: [], // 时间数组
      queryForm: {
        startTime: '',
        endTime: '',
        riskStatus: 2, // 审核状态
        receiverKeyWord: '' // 收件人信息
      },
      riskaData: [],
      inputData: ''
    }
  },
  created() {
    this.getCount();
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.tableContent.offsetHeight;
    })
    if (sessionStorage.getItem('pageFlag') && sessionStorage.getItem('path') === this.$route.path) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.searchData = {
        ...parameter
      }
      this.queryForm = {
        ...parameter
      }
      this.listQuery = {
        ...listQuery
      }
      this.timeList = [parameter.startTime, parameter.endTime];
    }
    this.getList();
  },
  methods: {
    // 关闭备注弹窗
    closeRemark() {
      this.remarkDialog = false;
    },
    // 查看备注
    viewRemark(row) {
      this.remarkDialog = true;
      this.remarkList = row.sellerRemark;
    },
    // 切换审核状态
    selectStatus() {
      this.getList();
    },
    // 统计订单数量
    getCount() {
      orderApi.getRiskCount().then(res => {
        if (res.code === 200) {
          console.log('数量', res);
          res.data.map(item => {
            console.log('item', item);
            switch (item.status) {
              case 10031:
                this.$set(this.riskStatusList[0], 'num', item.num);
                break;
              case 10032:
                this.$set(this.riskStatusList[2], 'num', item.num);
                break;
              case 10033:
                this.$set(this.riskStatusList[3], 'num', item.num);
                console.log('this.count[2]', this.count[2]);
                break;
              case 10034:
                this.$set(this.riskStatusList[4], 'num', item.num);
                break;
              case 10035:
                this.$set(this.riskStatusList[1], 'num', item.num);
                break;
              case 10036:
                this.$set(this.riskStatusList[5], 'num', item.num);
                break;
            }
          })
        }
      })
    },
    // 条件查询
    search() {
      this.listQuery = {
        page: 1,
        limit: 10
      }
      this.searchData = {
        ...this.queryForm
      }
      this.getList();
    },
    changeStatus() {
      // this.getList(this.searchData);
    },
    getList() {
      let riskStatusList = []
      let statusList = [];
      if (this.queryForm.riskStatus === 1) {
        riskStatusList = [10032]
      } else if (this.queryForm.riskStatus === 2) {
        statusList = [10031];
      } else if (this.queryForm.riskStatus === 3) {
        riskStatusList = [10033]
      } else if (this.queryForm.riskStatus === 4) {
        riskStatusList = [10034]
      } else if (this.queryForm.riskStatus === 5) {
        riskStatusList = [10036]
      } else if (this.queryForm.riskStatus === 6) {
        riskStatusList = [10035]
      }
      const data = {
        tableEnum: 'RISK_TABLE',
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        riskStatusList: riskStatusList,
        statusList: statusList,
        productKeyWord: this.searchData.productKeyWord,
        orderNo: this.searchData.orderNo,
        userKeyWord: this.searchData.userKeyWord,
        startTime: this.searchData.startTime,
        endTime: this.searchData.endTime,
        receiverKeyWord: this.searchData.receiverKeyWord
      }
      orderApi.orderList(data).then(res => {
        if (res.code === 200) {
          this.riskaData = res.data.list;
          this.total = res.data.totalRecords;
          // 每次回到列表页后都把标志清除掉，避免每次都从缓存中读取查询条件
          sessionStorage.removeItem('pageFlag');
          // 当前页的page pageSize赋值给分页组件，不然页码显示不正确
          this.listQuery.page = res.data.page;
          this.listQuery.limit = res.data.pageSize
        }
      })
    },
    clipboardSuccess() {
      console.log('复制成功');
    },
    goRule() {
      this.$router.push({
        name: 'riskaRule'
      })
    },
    // 风控订单详情页
    riskaDetail(no) {
      // 缓存必须在路由跳转之前
      this.searchData.riskStatus = this.queryForm.riskStatus;
      console.log('this.searchData：', this.searchData);
      saveParameter(this.$route.path, JSON.stringify(this.searchData), JSON.stringify(this.listQuery))
      this.$router.push({
        query: { orderNo: no },
        name: 'riskDetail'
      })
      // sessionStorage.setItem('pageFlag', true);
      // sessionStorage.setItem('parameter', JSON.stringify(this.searchData));
      // sessionStorage.setItem('listQuery', JSON.stringify(this.listQuery));
    },
    // 下单时间选择
    getTime(value) {
      this.queryForm.startTime = value ? value[0] : '';
      this.queryForm.endTime = value ? value[1] : '';
    },
    copy() {
      this.$message.success('已复制到粘贴板')
    },
    goOrderDetail(no) {
      saveParameter(this.$route.path, JSON.stringify(this.searchData), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: no
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .riska-container {
    padding: 15px;
    .riska-search {
      background-color: #ffffff;
      padding: 15px;
    }
    .riska-table {
      background-color: #fff;
      margin-top: 15px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      // .table-content {
      // }
    }
    .status-btn {
      margin-bottom: 16px;
    }
    .goods-container {
      display: flex;
      justify-content: flex-start;
      overflow: hidden;
      img {
        width: 50px;
        height: 50px;
      }

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 4px;
      }
      ul li {
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .brief {
        color: #969696;
        text-align: left
      }
    }

    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
    .risk-status-container {
      display: block;
      margin-bottom: 30px;
      // background-color: #cccccc;
    }
  }
</style>
<style lang="scss">
  .riska-container {
    .el-radio-button {
      margin-left: 10px;
      .el-radio-button__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
    }
    .el-radio-group label:nth-child(2) span {
      // border-left: 1px solid #dcdfe6;
      box-shadow: 0 0 0 0;
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

