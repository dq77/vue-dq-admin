<!--
 * @Description: In User Settings Edit
 * @Author: 刁琪
 * @Date: 2019-08-12 15:11:34
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-05 12:00:40
 -->
<template>
  <div class="order-container">
    <div class="order-search">
      <div class="add-order">
        <el-button class="add-btn" type="primary" @click="addOrder()">手动建单</el-button>
      </div>
      <el-form :model="queryForm" :inline="true" label-width="100px">
        <el-form-item label="订单类型">
          <el-select v-model="queryForm.tradeType" clearable>
            <el-option value="" label="全部" />
            <el-option value="Sales" label="售卖" />
            <el-option value="Renewal" label="续租" />
            <el-option value="Buyout" label="买断" />
            <el-option value="Lease" label="租赁" />
            <el-option value="Staging" label="Staging订单" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="queryForm.statusList" clearable>
            <el-option :label="`全部(${count[0]})`" value="" />
            <el-option :label="`待支付(${count[1]})`" value="[10010]" />
            <el-option :label="`支付中(${count[2]})`" value="[10020]" />
            <el-option :label="`待审核(${count[3]})`" value="[10031]" />
            <el-option :label="`待发货(${count[4]})`" value="[10041]" />
            <el-option :label="`待收货(${count[5]})`" value="[10042]" />
            <el-option :label="`租赁中(${count[6]})`" value="[10051]" />
            <el-option :label="`分期还款中(${count[7]})`" value="[10052]" />
            <el-option :label="`已完成(${count[8]})`" value="[10065]" />
            <el-option :label="`物品待归还(${count[9]})`" value="[10060]" />
            <el-option :label="`退货中(${count[12]})`" value="[10071,10072,10073,10074]" />
            <el-option :label="`已退货(${count[13]})`" value="[10080,10090]" />
            <el-option :label="`已取消(${count[14]})`" value="[10100]" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单渠道">
          <el-select v-model="queryForm.channel">
            <el-option value="" label="全部" />
            <el-option v-for="item in channelList" :key="item.code" :value="item.code" :label="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="订单号">
          <el-input v-model.trim="queryForm.orderNo" clearable class="input-174" placeholder="请输入订单号查询" />
        </el-form-item>
        <el-form-item label="商品关键字">
          <el-input v-model="queryForm.productKeyWord" clearable class="input-174" placeholder="请输入商品关键字" />
        </el-form-item>
        <el-form-item label="账单状态">
          <el-select v-model="queryForm.billStatus">
            <el-option value="" label="全部" />
            <el-option :value="0" label="正常分期付款中" />
            <el-option :value="1" label="已完成" />
            <el-option :value="2" label="逾期" />
            <el-option :value="3" label="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="买家搜索">
          <el-input v-model="queryForm.userKeyWord" clearable class="input-174" placeholder="请输入买家姓名、手机号" />
        </el-form-item>
        <el-form-item label="收货人搜索">
          <el-input v-model="queryForm.receiverKeyWord" clearable class="input-174" placeholder="请输入收件人姓名、手机号" />
        </el-form-item>
        <el-form-item label="测试订单">
          <el-radio-group v-model="queryForm.isTest">
            <el-radio label="false">不包含</el-radio>
            <el-radio label="true">包含</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker v-model="timeList" :default-time="['00:00:00', '23:59:59']" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime" />
        </el-form-item>
        <!-- <el-form-item label="业务模式">
          <el-select v-model="queryForm.businessTypes" clearable>
            <el-option value="" label="全部"/>
            <el-option :value="0" label="自营"/>
            <el-option :value="20" label="代租售"/>
          </el-select>
          <el-select v-model="queryForm.businessTypes" clearable>
            <el-option value="" label="全部"/>
            <el-option :value="0" label="支持代发货"/>
          </el-select>
          <el-input v-model="queryForm.labelCategoryName" class="input-180" placeholder="请输入代租售供应商名称" clearable/>
        </el-form-item> -->

        <div class="search-btn">
          <el-button icon="el-icon-search" type="primary" @click="search()">查询</el-button>
          <el-button icon="el-icon-search" type="primary" @click="exportOrder()">导出</el-button>
        </div>

      </el-form>
    </div>
    <div class="order-table">
      <div class="table-filter">
        <span>选择展示字段：</span>
        <el-select v-model="tableList" multiple collapse-tags placeholder="请选择需要展示的字段" @change="selectTable">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item" />
        </el-select>
      </div>
      <div ref="tableContent" class="table-content">
        <el-table :data="tableData" max-height="600" border>
          <el-table-column prop="orderNo" label="订单编号" fixed="left" min-width="160px" align="center">
            <template slot-scope="scope">
              <a href="javascript:;" @click="goDetail(scope.row)">{{ scope.row.orderNo }}</a>
            </template>
          </el-table-column>
          <el-table-column v-for="item in tableList" :key="item.value" :prop="item.value" :label="item.label" :class-name="arrayIndex(item.value)!=-1 ? 'merger': ''" :min-width="returnWidth(item.value) || width" align="center">
            <template slot-scope="scope">
              <!-- 当是商品字段时，遍历商品名称显示 -->
              <span v-if="item.value === 'goodsName'">
                <ul>
                  <li v-for="(good,index) in scope.row.orderDetailVos" :key="index" class="goodsView">
                    <el-popover trigger="hover" placement="top-start">
                      <img v-if="good.productInfo && good.productInfo.cover" :src="good.productInfo.cover" style="width:200px">
                      <img v-if="good.productInfo && good.productInfo.cover" slot="reference" :src="good.productInfo.cover" style="width:40px;height:40px">
                    </el-popover>
                    <div v-if="good.productInfo">
                      <el-tooltip :content="good.productInfo.name+ '*'+good.productInfo.count" effect="light" placement="top-start">
                        <span>{{ good.productInfo.name }} * {{ good.productInfo.count }}</span>
                      </el-tooltip>
                      <el-tooltip v-if="good.productInfo.detail" :content="good.productInfo.detail" effect="light" placement="top-start">
                        <span style="color: #969696;text-align: left"> 规格：{{ good.productInfo.detail }}</span>
                      </el-tooltip>
                    </div>
                  </li>
                </ul>
              </span>
              <div v-if="item.value === 'count'">
                <ul>
                  <li v-for="(no,index) in scope.row.orderDetailVos" :key="index">
                    {{ no.count }}
                  </li>
                </ul>
              </div>
              <span v-if="item.value === 'childNo'">
                <ul>
                  <li v-for="(no,index) in scope.row.orderDetailVos" :key="index">
                    {{ no.oid }}
                  </li>
                </ul>
              </span>
              <span v-else-if="item.value === 'freight'">
                {{ scope.row.freight || 0 + '$' }}
              </span>
              <!-- 当是续租订单时，显示续租标志 -->
              <span v-else-if="item.value === 'renewalTimes'">
                <ul>
                  <li v-for="(no,index) in scope.row.orderDetailVos" :key="index">
                    <span v-if="no.renewalFlag === 1">续租</span>
                    <span v-else>--</span>
                  </li>
                </ul>
              </span>
              <!-- 当是租期时，显示每个商品的租期和单位 -->
              <span v-else-if="item.value === 'term'">
                <ul>
                  <li v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                    {{ good.period }}
                    <span v-if="good.unit === '月'">个</span>
                    <span v-if="good.unit">{{ good.unit }}</span>
                  </li>
                </ul>
              </span>
              <!-- 订单金额 -->
              <span v-else-if="item.value==='totalAmount'">
                <ul>
                  <li v-for="(good,index) in scope.row.orderDetailVos" :key="index">
                    {{ good.totalRent + '$' }}
                  </li>
                </ul>
              </span>
              <!-- 优惠金额 -->
              <span v-else-if="item.value === 'apportionDiscount'">
                <ul>
                  <li v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                    {{ good.apportionDiscount + '$' }}
                  </li>
                </ul>
              </span>
              <!-- 应付金额 -->
              <span v-else-if="item.value === 'payableAmount'">
                <ul>
                  <li v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                    {{ good.payableAmount + '$' }}
                  </li>
                </ul>
              </span>
              <!-- 账期 -->
              <span v-else-if="item.value === 'bill'">
                <ul>
                  <li v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                    <span class="text-active">{{ good.paidCount }}</span><span
                      class="total-bill">{{ '/'+ good.billCount }}</span>
                  </li>
                </ul>
              </span>
              <!-- 订单状态 -->
              <span v-else-if="item.value === 'status'">
                <ul>
                  <li v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                    {{ good.status | orderStatusFilter }}
                  </li>
                </ul>
              </span>
              <!-- 订单类型 -->
              <span v-else-if="item.value === 'tradeType'">
                <span v-if="scope.row.tradeType === 'Lease'">租赁</span>
                <span v-if="scope.row.tradeType === 'Sales'">售卖</span>
                <span v-if="scope.row.tradeType === 'Renewal'">续租</span>
                <span v-if="scope.row.tradeType === 'Buyout'">买断</span>
                <span v-if="scope.row.tradeType === 'Staging'">Staging订单</span>
              </span>
              <!-- 业务模式 -->
              <span v-else-if="item.value === 'businessTypes'">
                <span v-if="scope.row.businessType === 0">自营</span>
                <span v-if="scope.row.businessType === 20">代租售</span>
              </span>
              <!-- 1是一次性 2是分期 -->
              <span v-else-if="item.value==='payType'">
                <span v-if="scope.row.payType === 1">一次性支付</span>
                <span v-if="scope.row.payType === 2">分期支付</span>
              </span>
              <!-- 收件人信息 -->
              <span v-else-if="item.value==='recevie'">
                <div>收件人：{{ scope.row.receiverName }}</div>
                <div>手机号：{{ scope.row.receiverMobile }}</div>
              </span>
              <!-- 收件地址合并 -->
              <span v-else-if="item.value==='address'">
                <span
                  v-if="scope.row.address && scope.row.address.indexAndDetail">{{ scope.row.address.indexAndDetail[1] }}</span>
                <span
                  v-if="scope.row.address && scope.row.address.indexAndDetail">{{ scope.row.address.indexAndDetail[2] }}</span>
                <span
                  v-if="scope.row.address && scope.row.address.districts">{{ scope.row.address.districts[2].name }}</span>
                <span
                  v-if="scope.row.address && scope.row.address.districts">{{ scope.row.address.districts[1].name }}</span>
              </span>
              <!-- 风控审核状态 -->
              <span v-else-if="item.value === 'riskStatus'">
                <span v-if="scope.row.riskStatus === 10031">待风控审核</span>
                <span v-else-if="scope.row.riskStatus === 10032">风控审核通过</span>
                <span v-else-if="scope.row.riskStatus === 10033">风控审核拒绝</span>
                <span v-else-if="scope.row.riskStatus === 10034">自动风控拒绝</span>
                <span v-else-if="scope.row.riskStatus === 10035">风控审核中</span>
                <span v-else-if="scope.row.riskStatus === 10036">自动通过</span>
                <span v-else>--</span>
              </span>
              <span v-else-if="item.value === 'channel'">
                <span>{{ scope.row.channel | channelFilter }}</span>
              </span>
              <span v-else-if="item.value === 'buyerRemark'">
                <span>{{ scope.row.buyerRemark }}</span>
              </span>
              <!-- 备注 -->
              <span v-else-if="item.value === 'orderRemark'">
                <a href="javascript:;" @click="remarkView(scope.row.sellerRemark)">
                  <span v-if="scope.row.sellerRemark" class="orderRemark">{{ scope.row.sellerRemark[0].content }}</span>
                </a>
              </span>
              <span v-else-if="item.value === 'billStatus'">
                <span v-if="scope.row.billStatus === 0">正常分期还款中</span>
                <span v-if="scope.row.billStatus === 1">已完成</span>
                <span v-if="scope.row.billStatus === 2">有逾期</span>
                <span v-if="scope.row.billStatus === 3">已关闭</span>
              </span>
              <div v-else-if="item.value === 'cid'">
                <span v-if="scope.row.cid === 1">科技侠</span>
                <span v-if="scope.row.cid === 2">乐乎公寓</span>
                <span v-if="scope.row.cid === 3">有巢</span>
              </div>
              <!-- 否则直接显示相对应的字段 -->
              <span v-else>
                <span>{{ scope.row[item.value] }}</span>
              </span>
              <!-- 企业来源 -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" fixed="right">
            <template slot-scope="scope">
              <el-button icon="el-icon-view" plain type="primary" @click="goDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <form ref="hiddenForm" :action="baseurl" method="post" style="display:none" target="targetIfr">
        <input ref="input">
      </form>
      <iframe name="targetIfr" style="display:none" />
    </div>
    <el-dialog :visible.sync="remarkDialog" title="客服备注" center>
      <el-table :data="remarkObj" border>
        <el-table-column label="时间" prop="operateTime" />
        <el-table-column label="内容" prop="content" />
        <el-table-column label="操作人" prop="username" />
      </el-table>
      <div slot="footer">
        <el-button type="info" @click="cancel()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'
import pagination from '@/components/Pagination/index.vue'
import orderApi from '@/api/order/order.js'
import goodsApi from '@/api/goods.js'
import { baseUrl } from '@/common/config.js'
// import { deepClone } from '@/utils/index.js'
import { saveParameter } from '@/utils/saveParameter.js'
export default {
  components: {
    pagination
  },
  directives: {
    clipboard
  },
  data() {
    return {
      width: 100,
      baseurl: `${baseUrl}/orders/export`,
      channelList: [],
      tempSearch: {
        billStatus: '',
        tradeType: '',
        statusList: '',
        startTime: '',
        orderNo: '',
        productKeyWord: '',
        userKeyWord: '',
        receiverKeyWord: '',
        endTime: '',
        channel: '',
        isTest: 'false'
      }, // 查询中间数据存储
      count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      queryForm: {
        billStatus: '',
        tradeType: '',
        statusList: '',
        startTime: '',
        orderNo: '',
        productKeyWord: '',
        userKeyWord: '',
        receiverKeyWord: '',
        endTime: '',
        channel: '',
        isTest: 'false'
      },
      height: 500,
      timeList: [],
      remarkDialog: false, // 订单备注
      remarkObj: {
        operateTime: '',
        content: '',
        userName: ''
      },
      tableList: [],
      total: 0,
      tableData: [],
      arr: [], // 解析后的表格数据
      options: [
        { value: 'createTime', label: '下单时间', width: '146' },
        { value: 'tradeType', label: '订单类型', width: '90' },
        // { value: 'businessTypes', label: '订单模式' },
        { value: 'channel', label: '渠道', width: '80' },
        { value: 'goodsName', label: '商品名称', width: '200' },
        { value: 'count', label: '数量', width: '50' },
        { value: 'childNo', label: '子订单号', width: '150' },
        { value: 'term', label: '租期', width: '70' },
        { value: 'payType', label: '分期信息', width: '90' },
        { value: 'totalAmount', label: '订单金额', width: '100' },
        { value: 'paidAmount', label: '已付金额', width: '100' },
        { value: 'apportionDiscount', label: '优惠金额', width: '100' },
        { value: 'payableAmount', label: '应付金额', width: '100' },
        { value: 'bill', label: '已付/应付账期', width: '80' },
        { value: 'freight', label: '运费', width: '60' },
        { value: 'renewalTimes', label: '续租标志', width: '60' },
        { value: 'uid', label: '买家id', width: '70' },
        { value: 'username', label: '买家昵称', width: '120' },
        { value: 'userMobile', label: '买家手机号', width: '110' },
        { value: 'recevie', label: '收件联系人', width: '150' },
        { value: 'address', label: '收件地址', width: '200' },
        { value: 'buyerRemark', label: '买家备注', width: '150' },
        { value: 'orderRemark', label: '备注', width: '150' },
        { value: 'riskStatus', label: '风控审核状态', width: '100' },
        { value: 'status', label: '订单状态', width: '100' },
        { value: 'billStatus', label: '账单状态', width: '100' },
        { value: 'cid', label: '企业名称' }
      ],
      listQuery: {
        limit: 10,
        page: 1
      }
    }
  },
  created() {
    this.getStatusCount();
    this.getChannel();
    this.tableList = localStorage.getItem('tableList') ? JSON.parse(localStorage.getItem('tableList')) : this.options;
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && sessionStorage.getItem('path') === this.$route.path) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.tempSearch = { ...parameter }
      this.queryForm = { ...parameter }
      this.listQuery = { ...listQuery }
      // this.queryForm.statusList = JSON.stringify(this.queryForm.statusList)=== '[]' ? '' : JSON.stringify(this.queryForm.statusList);
      if (parameter.startTime && parameter.endTime) {
        this.timeList = [parameter.startTime, parameter.endTime];
      }
    }
    this.getList();
  },
  methods: {
    returnWidth(value) {
      let temp = null;
      temp = this.tableList.find((item) => {
        return item.value === value
      })
      const width = temp ? temp.width : '';
      return width;
    },
    // 获取渠道下拉框
    getChannel() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        }
      })
    },
    // 订单数量统计
    getStatusCount() {
      orderApi.getCount().then(res => {
        if (res.code === 200) {
          console.log('订单数量统计', res);
          res.data.map(item => {
            switch (item.status) {
              case 10010: this.count[1] += item.num; this.count[0] += item.num; break;
              case 10020: this.count[2] += item.num; this.count[0] += item.num; break;
              case 10031: this.count[3] += item.num; this.count[0] += item.num; break;
              case 10041: this.count[4] += item.num; this.count[0] += item.num; break;
              case 10042: this.count[5] += item.num; this.count[0] += item.num; break;
              case 10051: this.count[6] += item.num; this.count[0] += item.num; break;
              case 10052: this.count[7] += item.num; this.count[0] += item.num; break;
              case 10065: this.count[8] += item.num; this.count[0] += item.num; break;
              case 10060: this.count[9] += item.num; this.count[0] += item.num; break;
              case 10071: this.count[12] += item.num; this.count[0] += item.num; break;
              case 10073: this.count[12] += item.num; this.count[0] += item.num; break;
              case 10074: this.count[12] += item.num; this.count[0] += item.num; break;
              case 10080: this.count[13] += item.num; this.count[0] += item.num; break;
              case 10090: this.count[13] += item.num; this.count[0] += item.num; break;
              case 10100: this.count[14] += item.num; this.count[0] += item.num; break;
            }
            console.log('订单数量', this.count[0]);
          })
        }
      })
    },
    arrayIndex(value) {
      var arr = ['goodsName', 'childNo', 'term', 'apportionDiscount', 'payableAmount', 'bill', 'totalAmount', 'renewalTimes', 'status'];
      return arr.indexOf(value)
    },
    // 获取列表页
    getList() {
      const data = {
        tableEnum: 'ORDER_TABLE',
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        isTest: 'false',
        ...this.tempSearch
      }
      data.statusList = data.statusList ? JSON.parse(data.statusList) : [];
      orderApi.orderList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.totalRecords;
          // 每次回到列表页后都把标志清除掉，避免每次都从缓存中读取查询条件
          sessionStorage.removeItem('pageFlag');
          // 当前页的page pageSize赋值给分页组件，不然页码显示不正确
          this.listQuery.page = res.data.page;
          this.listQuery.limit = res.data.pageSize
        }
      })
    },
    // 订单号复制
    onCopy() {
      this.$message.success('已复制到剪切板')
    },
    onError() {
      this.$message.error('复制失败')
    },
    selectTable() {
      console.log('展示的列表字段', this.tableList);
      localStorage.setItem('tableList', JSON.stringify(this.tableList));
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 手动建单
    addOrder() {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery))
      this.$router.push({
        name: 'orderListCreat'
      })
    },
    // 订单详情页
    goDetail(value) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery))
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: value.orderNo
        }
      })
    },
    // 下单时间选择
    getTime(value) {
      console.log('时间选择器', value);
      this.queryForm.startTime = value ? value[0] : '';
      this.queryForm.endTime = value ? value[1] : '';
    },
    // 根据条件查询
    search() {
      this.tempSearch = {
        billStatus: this.queryForm.billStatus,
        endTime: this.queryForm.endTime || '',
        startTime: this.queryForm.startTime || '',
        orderNo: this.queryForm.orderNo || '',
        productKeyWord: this.queryForm.productKeyWord || '',
        receiverKeyWord: this.queryForm.receiverKeyWord || '',
        statusList: this.queryForm.statusList || '',
        tradeType: this.queryForm.tradeType || '',
        channel: this.queryForm.channel || '',
        userKeyWord: this.queryForm.userKeyWord || '',
        isTest: this.queryForm.isTest || ''
      }
      this.listQuery.page = 1;
      this.listQuery.pageSize = 10;
      this.getList();
    },
    // 订单导出
    exportOrder() {
      var form = this.$refs.hiddenForm;
      var input = this.$refs.input;
      var queryForm = {
        billStatus: this.queryForm.billStatus,
        endTime: this.queryForm.endTime || '',
        startTime: this.queryForm.startTime || '',
        orderNo: this.queryForm.orderNo || '',
        userKeyWord: this.queryForm.userKeyWord || '',
        productKeyWord: this.queryForm.productKeyWord || '',
        receiverKeyWord: this.queryForm.receiverKeyWord || '',
        statusList: this.queryForm.statusList ? JSON.parse(this.queryForm.statusList) : [],
        tradeType: this.queryForm.tradeType || '',
        channel: this.queryForm.channel || '',
        isTest: this.queryForm.isTest
      }
      input.type = 'hidden';
      input.name = 'ordersQueryStr';
      input.value = JSON.stringify(queryForm);
      form.submit();
    },

    // 查看客服备注
    remarkView(value) {
      this.remarkDialog = true;
      this.remarkObj = value;
    },
    // 关闭备注弹窗
    cancel() {
      this.remarkDialog = false;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.order-container {
  padding: 20px;
  font-size: 14px;
  font-family: Helvetica Neue For Number, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei,
    Helvetica Neue, Helvetica, Arial, sans-serif;
  .order-search {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    .add-order{
      margin-bottom: 15px;
      .add-btn{
        float: right;
      }
    }
    .input-174 {
      width: 174px;
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .order-table {
    padding: 20px;
    background-color: #fff;
    .table-filter {
      margin-bottom: 16px;
      color: #606266;
    }
  }
  .copy {
    margin-left: 15px;
  }
  .orderRemark {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  a {
    color: #4da9ec;
  }
  .text-active {
    color: #2ecc71;
  }
  .goodsView {
    display: flex;
    img  {
      width: 40px;
      height: 40px;
    }
    div {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
<style lang="scss">
.el-table {
  .merger {
    padding: 0;
    .cell {
      padding: 0;
    }
    ul {
      margin: 0;
    }
    ul li {
      list-style-type: none;
      border-bottom: 1px solid #ebeef5;
      text-align: center;
      div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

    }
    ul li:last-of-type {
      border-bottom: 0;
    }
  }
}
</style>
