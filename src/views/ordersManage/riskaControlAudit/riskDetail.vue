<template>
  <div class="risk-detail">
    <div class="header-btn">
      <el-button type="primary" icon="el-icon-back" @click="goBack()">返回</el-button>
      <div>
        <el-button v-if="riskStatus === 10031 || riskStatus === 10035" type="primary" icon="el-icon-view" @click="review()">审核</el-button>
        <el-button v-if="riskStatus === 10031" type="primary" icon="el-icon-view" @click="processing()">置为处理中</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addRemark()">备注</el-button>
      </div>
    </div>
    <div class="risk-detail-content">
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <span>订单信息</span>
          <span class="order-status">{{ riskStatus | orderStatusFilter }} <span v-if="refuseReason">（{{ refuseReason }}）</span></span>
        </div>
        <div class="text item">
          <el-table :data="orderInfo" border>
            <el-table-column label="订单号" min-width="150px" fixed="left">
              <template slot-scope="scope">
                <a href="javascript:;" class="a-color" @click="orderDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</a>
              </template>
            </el-table-column>
            <el-table-column label="渠道">
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
              </template>
            </el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                <span>{{ scope.row.status | orderStatusFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品名" width="200px" class-name="good-merge">
              <template slot-scope="scope">
                <div v-for="item in scope.row.ordersProductInfo" :key="item.skuId" class="goods-name">
                  <img :src="item.cover" style="width:40px;height:40px">
                  <ul>
                    <li>{{ item.name }}</li>
                    <li class="brief">规格：{{ item.detail }}</li>
                  </ul>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.ordersProductInfo" :key="item.oid+index">{{ item.count }}</div>
              </template>
            </el-table-column>
            <el-table-column label="订单金额">
              <template slot-scope="scope">
                <ul v-if="scope.row.orderDetailVos.length > 0">
                  <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                    {{ good.totalRent + '$' }}
                  </li>
                </ul>
                <div v-else>{{ scope.row.totalRent + '$' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="已付金额" prop="paidAmount">
              <template slot-scope="scope">
                <div v-if="scope.row.orderDetailVos.length > 0">
                  <div v-for="(item, index) in scope.row.orderDetailVos" :key="index">{{ item.paidAmount + '$' }}</div>
                </div>
                <div v-else>{{ scope.row.paidAmount + '$' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="押金">
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
            <el-table-column label="实付押金">
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
            <el-table-column label="租期">
              <template slot-scope="scope">
                <ul v-if="scope.row.orderDetailVos.length > 0">
                  <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                    {{ good.period }}<span v-if="good.unit === '月'">个</span>{{ good.unit }}
                  </li>
                </ul>
                <div v-else>{{ scope.row.period }}<span v-if="scope.row.unit === '月'">个</span>{{ scope.row.unit }}</div>
              </template>
            </el-table-column>
            <el-table-column label="分期" align="center">
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
            <el-table-column label="用户信息" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.username }}--</div>
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
            <el-table-column label="下单时间" prop="createTime" min-width="150px"/>
            <el-table-column label="身份证号" prop="idCard" min-width="150px"/>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <el-button type="text" class="customer-remark" @click="remarkView(scope.row.sellerRemark)">
                  <el-popover
                    trigger="hover">
                    <span v-if="scope.row.sellerRemark">{{ scope.row.sellerRemark[0].content }}</span>
                    <span v-if="scope.row.sellerRemark" slot="reference" >{{ scope.row.sellerRemark[0].content }}</span>
                  </el-popover>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="审核时间" align="center" prop="riskTime"/>
          </el-table>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="card-header">
          <span>历史下单信息</span>
        </div>
        <el-table :data="historyOrderInfo" border max-height="500">
          <el-table-column label="订单号" min-width="150px">
            <template slot-scope="scope">
              <a href="javascript:;" class="a-color" @click="orderDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</a>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="scope">
              <span v-if="scope.row.totalRent">{{ scope.row.totalRent + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeType === 'Lease'">租赁</span>
              <span v-if="scope.row.tradeType === 'Sales'">售卖</span>
              <span v-if="scope.row.tradeType === 'Renewal'">续租</span>
              <span v-if="scope.row.tradeType === 'Buyout'">买断</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
              <span>{{ scope.row.status | orderStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名" width="200px" class-name="good-merge">
            <template slot-scope="scope">
              <div v-for="item in scope.row.ordersProductInfo" :key="item.skuId" class="goods-name">
                <img :src="item.cover" style="width:40px;height:40px">
                <ul>
                  <li>{{ item.name }}</li>
                  <li>{{ item.brief }}</li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="createTime" min-width="150px"/>
          <el-table-column label="渠道" prop="channel">
            <template slot-scope="scope">
              <span>{{ scope.row.channel | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.ordersProductInfo" :key="item.oid+index">{{ item.count }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                  {{ good.totalRent + '$' }}
                </li>
              </ul>
              <div v-else>{{ scope.row.totalRent + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="已付金额" prop="paidAmount">
            <template slot-scope="scope">
              <div v-if="scope.row.orderDetailVos.length > 0">
                <div v-for="(item, index) in scope.row.orderDetailVos" :key="index">{{ item.paidAmount + '$' }}</div>
              </div>
              <div v-else>{{ scope.row.paidAmount + '$' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="押金">
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
          <el-table-column label="实付押金">
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
          <el-table-column label="租期">
            <template slot-scope="scope">
              <ul v-if="scope.row.orderDetailVos.length > 0">
                <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                  {{ good.period }}<span v-if="good.unit === '月'">个</span>{{ good.unit }}
                </li>
              </ul>
              <div v-else>{{ scope.row.period }}<span v-if="scope.row.unit === '月'">个</span>{{ scope.row.unit }}</div>
            </template>
          </el-table-column>
          <el-table-column label="分期" align="center">
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
          <el-table-column label="用户信息" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.username }}--</div>
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
          <el-table-column label="身份证号" prop="idCard" min-width="150px"/>
          <el-table-column label="风控状态">
            <template slot-scope="scope">
              <span v-if="scope.row.riskStatus === 10031">待审核</span>
              <span v-else-if="scope.row.riskStatus === 10032">审核通过</span>
              <span v-else-if="scope.row.riskStatus === 10033">审核拒绝</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="还款状态"/> -->
          <el-table-column label="客服备注" min-width="150px">
            <template slot-scope="scope">
              <el-button type="text" class="customer-remark" @click="remarkView(scope.row.sellerRemark)">
                <el-popover
                  trigger="hover">
                  <span v-if="scope.row.sellerRemark">{{ scope.row.sellerRemark[0].content }}</span>
                  <span v-if="scope.row.sellerRemark" slot="reference" >{{ scope.row.sellerRemark[0].content }}</span>
                </el-popover>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" prop="riskTime"/>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="viewBill(scope.row.orderNo)">查看账单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" :page-sizes="[5,10,15,20]" @pagination="getList"/>
      </el-card>
      <el-card>
        <div slot="header" class="card-header">
          <span>风控信息</span>
        </div>
        <risk-info :data-source="common" @qianHai="slefSearchQianHai" @pagination="getRiskList"/>
      </el-card>
    </div>
    <bill-log :data="no" :show="billDialog" @close="billClose"/>
    <el-dialog :visible.sync="remarkDialog" title="客服备注" center>
      <el-table :data="remarkData" border>
        <el-table-column label="时间" prop="operateTime"/>
        <el-table-column label="备注" prop="content"/>
        <el-table-column label="操作人" prop="username"/>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="addRemarkDialog" center title="添加备注" width="550px">
      <el-form ref="remarkForm" :model="remarkForm" :rules="remarkRule" label-width="150px">
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="remarkForm.remark" :rows="3" type="textarea" class="input-300" placeholder="不可以提交空的备注哦~"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancelRemark('remarkForm')">取消</el-button>
        <el-button type="primary" @click="save('remarkForm')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="reviewDialog" :title="operationType === 1111 ? '审核' : '置为处理中'" center width="600px" @close="cancelApproval">
      <el-form ref="reviewForm" :model="reviewForm" :rules="reviewFormRule" label-width="100px">
        <el-form-item v-if="operationType === 1111" label="审核结果：" prop="type">
          <el-radio-group v-model="reviewForm.type">
            <el-radio-button :label="10032">通过</el-radio-button>
            <el-radio-button :label="10033">拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :rules="operationType === 1000 ? remark : (reviewForm.type === 10033 ? remark : null)" label="备注：" prop="remark">
          <el-input v-model="reviewForm.remark" :rows="3" type="textarea" placeholder="建议填写备注"/>
        </el-form-item>
        <el-form-item label="发送短信：" prop="isMessage">
          <el-radio-group v-model="reviewForm.isMessage" @change="isMessage">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="reviewForm.isMessage" label="短信内容：" prop="message">
          <el-radio-group v-model="reviewForm.messageType" @change="selectMessage">
            <el-radio v-if="operationType === 1000" :label="1111" border>联系失败通知</el-radio>
            <el-radio v-if="operationType === 1111" :label="2222" border>审核通过通知</el-radio>
            <el-radio v-if="operationType === 1111" :label="3333" border>审核拒绝通知</el-radio>
            <el-radio :label="4444" border>其他</el-radio>
          </el-radio-group>
          <el-input v-model="reviewForm.message" :disabled="reviewForm.messageType === 1111 || reviewForm.messageType === 2222 || reviewForm.messageType === 3333" :rows="4" type="textarea" class="message-input" placeholder="请输入短信内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancelApproval">取消</el-button>
        <el-button v-if="operationType === 1111" type="primary" @click="submit('reviewForm')">提交审核结果</el-button>
        <el-button v-if="operationType === 1000" type="primary" @click="submit('reviewForm')">置为处理中</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
import riskApi from '@/api/order/riska.js'
import orderApi from '@/api/order/order.js'
import riskInfo from './component/riskInfo'
import billLog from './component/billLog'
export default {
  components: {
    pagination,
    'risk-info': riskInfo,
    'bill-log': billLog
  },
  data() {
    return {
      message: [
        {
          value: 1111, // 联系失败信息
          label: '您好，这里是淘租公。您的产品在发货前是需要与您本人电话核对订单信息的。请注意留意接听杭州固话或手机电话的哦，谢谢您的配合！'
        },
        {
          value: 2222, // 审核通过信息
          label: '尊敬的小主，您的宝贝已经审核通过啦！快递将在24小时内发出，请保持手机畅通，确认包裹完好再签收。若有疑问，请联系在线客服，或拨打电话0571-8518 0735 ！'
        },
        {
          value: 3333, // 审核拒绝短信
          label: '尊敬的用户，您好！很遗憾的通知您，您的订单信息审核未通过，现已帮您安排取消。款项会在3个工作日内退还到您的账户，请您注意查收！若有疑问，请联系在线客服，或拨打电话0571-8518 0735 ！'
        },
        {
          value: 4444, // 其他
          label: ''
        }
      ],
      common: {},
      refuseReason: '', // 自动拒绝原因
      remarkData: [],
      remarkDialog: false,
      reviewDialog: false, // 风控审核弹窗
      processingDialog: false, // 置为处理中弹窗
      operationType: 1111, // 1111 审核操作  1000 置为处理中
      reviewForm: {
        type: 10000,
        remark: '',
        isMessage: 0, // 是否发送短信
        messageType: 1000, // 短信类型 1111 联系失败通知 2222 审核通过通知 3333审核拒绝通知 4444 其他
        message: '' // 短信内容
      }, // 风控审核时的表单
      billDialog: false, // 查看账单弹窗
      no: '',
      addRemarkDialog: false,
      riskStatus: '',
      total: 1,
      orderInfo: [],
      radio3: '',
      remarkForm: {
        remark: ''
      },
      remarkRule: {
        remark: [
          { required: true, message: '空备注不能提交', trigger: 'blue' }
        ]
      },
      remark: [
        { required: true, message: '请填写备注', trigger: 'blur' }
      ],
      reviewFormRule: {
        type: [
          { required: true, message: '请选择审核结果', trigger: ' blur ' }
        ],
        message: [
          { required: true, message: '请填写短信内容', trigger: 'blur' }
        ],
        isMessage: [
          { required: true, message: '请选择是否发送短信', trigger: 'blur' }
        ]
      },
      historyOrderInfo: [],
      tdRiskVo: {},
      listQuery: {
        page: 1,
        pageSize: 5
      }
    }
  },
  created() {
    console.log('风控订单号', this.$route.query.orderNo);
    this.getDetail(this.$route.query.orderNo);
    this.searchTongDun({ orderNo: this.$route.query.orderNo, page: 1, pageSize: 5 })
    this.getHistoryDetail(this.$route.query.orderNo);
  },
  methods: {
    getDetail(no) {
      const data = {
        orderNo: no
      }
      riskApi.getDetail(data).then(res => {
        if (res.code === 200) {
          this.orderInfo = [];
          console.log('风控详情', res.data);
          this.riskStatus = res.data.orderInfo.riskStatus;
          this.refuseReason = res.data.refuseReason;
          this.orderInfo.push(res.data.orderInfo);
        }
      })
    },
    // 分页查询接口
    getRiskList(val) {
      const data = {
        page: val.page,
        pageSize: val.pageSize,
        orderNo: this.$route.query.orderNo
      }
      if (val.activeName === 'first') {
        this.searchTongDun(data);
      } else if (val.activeName === 'second') {
        this.searchMuJin(data);
      } else if (val.activeName === 'third') {
        this.searchQianHai(data);
      }
    },
    // 主动查询前海
    slefSearchQianHai(val) {
      const data = {
        orderNo: this.$route.query.orderNo,
        page: val.page,
        pageSize: val.pageSize
      }
      riskApi.selfSearchQianHai(data).then(res => {
        if (res.code === 200) {
          this.$set(this.common, 'qianHaiInfos', res.data.list);
          this.$set(this.common, 'total', res.data.totalCount)
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 查询前海数据
    searchQianHai(data) {
      riskApi.searchQianHai(data).then(res => {
        if (res.code === 200) {
          this.$set(this.common, 'qianHaiInfos', res.data.list);
          this.$set(this.common, 'total', res.data.totalCount)
          // this.common.qianHaiInfos = res.data;
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 木槿数据
    searchMuJin(data) {
      riskApi.searchMuJin(data).then(res => {
        if (res.code === 200) {
          this.$set(this.common, 'muJinInfo', res.data.list);
          this.$set(this.common, 'total', res.data.totalCount)
          // this.common.muJinInfo = res.data;
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    // 同盾数据
    searchTongDun(data) {
      riskApi.searchTongDun(data).then(res => {
        if (res.code === 200) {
          this.$set(this.common, 'tongDunInfos', res.data.list);
          this.$set(this.common, 'total', res.data.totalCount)
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 获取历史订单
    getHistoryDetail(no) {
      const data = {
        orderNo: no,
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize
      }
      riskApi.getHistoryDetail(data).then(res => {
        if (res.code === 200) {
          this.historyOrderInfo = res.data.list;
          this.total = res.data.totalCount;
        }
      })
    },
    // 获取订单详情
    orderDetail(id) {
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: id
        }
      })
    },
    goBack() {
      this.$router.go(-1);
    },
    getList() {
      this.getHistoryDetail(this.$route.query.orderNo);
    },
    viewBill(no) {
      this.no = no;
      this.billDialog = true;
    },
    // 关闭账单弹窗
    billClose() {
      this.no = '';
      this.billDialog = false;
    },
    // 打开备注弹窗
    addRemark() {
      this.addRemarkDialog = true;
    },
    // 保存备注
    save(remarkForm) {
      this.$refs[remarkForm].validate(valid => {
        if (valid) {
          const data = {
            orderNo: this.orderInfo[0].orderNo,
            remark: this.remarkForm.remark
          }
          console.log('data', data);
          orderApi.addRemark(data).then(res => {
            if (res.code === 200) {
              this.$refs[remarkForm].clearValidate();
              this.$refs[remarkForm].resetFields();
              this.addRemarkDialog = false;
              this.$message.success('保存成功！');
              this.getDetail(this.$route.query.orderNo);
              this.getHistoryDetail(this.$route.query.orderNo);
            } else {
              this.$message.info(res.msg)
            }
          })
        } else {
          return false;
        }
      })
    },
    // 关闭弹窗
    cancelRemark(remarkForm) {
      this.addRemarkDialog = false;
      this.$refs[remarkForm].clearValidate();
      this.$refs[remarkForm].resetFields();
    },
    review() {
      this.operationType = 1111; // 1111 审核  1000 置为处理中
      this.reviewDialog = true;
    },
    // 将审核状态置为处理中
    processing() {
      this.operationType = 1000; // 1111 审核  1000 置为处理中
      this.reviewDialog = true;
    },
    // 是否选择短信
    isMessage(val) {
      // 如果是处理中操作则 默认值是失败短信
      if (this.operationType === 1000 && val) {
        this.$set(this.reviewForm, 'messageType', 1111);
        this.selectMessage();
      } else if (this.operationType === 1111 && val) {
        if (!this.reviewForm.type) {
          this.$message.warning('请选择审核结果！');
          this.reviewForm.isMessage = null;
        } else {
          if (this.reviewForm.type === 10032) {
            this.$set(this.reviewForm, 'messageType', 2222)
          } else {
            this.$set(this.reviewForm, 'messageType', 3333)
          }
          this.selectMessage();
        }
      } else if (!val) {
        this.$set(this.reviewForm, 'messageType', null);
        this.$set(this.reviewForm, 'message', '');
      }
    },
    // 选择信息
    selectMessage() {
      const val = this.reviewForm.messageType;
      if (val) {
        this.message.map(item => {
          if (item.value === val) {
            this.$set(this.reviewForm, 'message', item.label)
          }
        })
      } else {
        this.reviewForm.message = '';
      }
    },
    // 关闭弹窗
    cancelApproval() {
      this.resetForm('reviewForm');
    },
    // 审核结果提交
    submit(reviewForm) {
      this.$refs[reviewForm].validate(valid => {
        if (valid) {
          if (this.reviewForm.remark) {
            this.reviewForm.remark = '【风控备注】' + this.reviewForm.remark;
          }
          this.getSubmitValue(this.reviewForm);
        }
      })
    },
    // 不同的操作传不同的值
    getSubmitValue(value) {
      const data = {
        orderNo: this.orderInfo[0].orderNo,
        remark: this.reviewForm.remark,
        code: this.reviewForm.type,
        message: this.reviewForm.message
      }
      // 如果是审核操作
      if (this.operationType === 1111) {
        this.operationType
      } else if (this.operationType === 1000) {
        // 职位处理中操作
        data.code = 10035
      }
      this.riskOperation(data);
    },
    // resetForm
    resetForm(resetForm) {
      this.$refs[resetForm].clearValidate();
      this.$refs[resetForm].resetFields();
      this.reviewDialog = false;
    },
    // 风控审核通过
    riskOperation(data) {
      riskApi.riskOperation(data).then(res => {
        if (res.code === 200) {
          // this.$message.success('通过！');

          this.resetForm('reviewForm');
          this.$router.push(
            {
              name: 'riskaControlAudit'
            }
          )
        } else {
          this.$message.info(res.msg)
        }
      })
    },

    // 查看备注
    remarkView(data) {
      this.remarkData = data;
      this.remarkDialog = true;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .risk-detail {
    padding: 15px;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    .risk-detail-content {
      flex: 1;
      overflow: auto;
    }
    .header-btn {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 0 10px;
    }
    .el-card {
      margin-bottom: 16px;
      .card-header {
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
        .order-status {
          color: orange;
          margin-left: 25px;
        }
      }
    }
    .footer {
      width: 100%;
      padding: 20px;
      background-color: #fff;
      text-align: center;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin-bottom: 20px;
      border-radius: 4px;
    }
    // .box-card {
    // }
    .goods-name {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      ul {
        margin-left: 10px;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
      }
      ul li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ul li:last-child {
        color: #9A9897;
      }
    }
    .order-remark {
      margin-top: 20px;
      span {
        width: 100px;
      }
      display: flex;
      justify-content: flex-start;
    }
    .customer-remark {
      display: block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .message-input {
      margin-top: 15px;
    }
  }
</style>
<style lang="scss">
  .risk-detail {
    .good-merge {
      padding: 0;
      .cell {
        padding: 0;
      }
      .goods-name {
        border-bottom: 1px solid #ebeef5;
      }
      .cell div:last-of-type {
        border: 0;
      }
    }
  }
</style>
