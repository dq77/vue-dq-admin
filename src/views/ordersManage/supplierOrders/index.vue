<template>
  <div class="supplier-order-container">
    <div class="supplier-search">
      <el-radio-group v-model="query.supplierMode" class="risk-status-tab" @change="selectStatus">
        <el-radio-button label="[&quot;DELIVER&quot;]">代发订单</el-radio-button>
        <el-radio-button label="[&quot;SELLING&quot;]">代租售订单</el-radio-button>
      </el-radio-group>
      <el-form :model="query" :inline="true" label-width="120px">
        <el-form-item label="订单状态：">
          <el-select v-model="query.statusList" clearable>
            <el-option label="待支付" value="[10010]"/>
            <el-option label="支付中" value="[10020]"/>
            <el-option label="待审核" value="[10031]"/>
            <el-option label="待发货" value="[10041]"/>
            <el-option label="待收货" value="[10042]"/>
            <el-option label="租赁中" value="[10051]"/>
            <el-option label="分期还款中" value="[10052]"/>
            <el-option label="已完成" value="[10065]"/>
            <el-option label="物品待归还" value="[10060]"/>
            <el-option label="退货中" value="[10071,10072,10073,10074]"/>
            <el-option label="已退货" value="[10080,10090]"/>
            <el-option label="已取消" value="[10100]"/>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号：">
          <el-input v-model="query.orderNo" clearable placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="供应商名称：">
          <el-input v-model="query.supplierKeyword" clearable placeholder="请输入供应商名称" />
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button :loading="exporting" type="primary" @click="exportOrder">导出{{ exporting?'中':'' }}</el-button>
      </div>
    </div>
    <div class="content">
      <div class="erp-content">
        <el-table :data="orderData" border>
          <el-table-column label="订单号" prop="orderNo"/>
          <el-table-column label="订单时间" prop="createTime"/>
          <el-table-column label="店铺" prop="merchant">
            <template slot-scope="scope">
              <div v-for="(product, index) in scope.row.ordersProductInfo" :key="index">
                <div>{{ product.merchant ? JSON.parse(product.merchant).name : '--' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品" prop="goodsList">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <span>{{ good.productInfo.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="goodsList">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <div>{{ good.productInfo.count }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" prop="totalRent">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <div>{{ good.totalRent + '$' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额" prop="apportionDiscount">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <div>{{ good.apportionDiscount + '$' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="应付金额" prop="payableAmount">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <div>{{ good.payableAmount + '$' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="已付金额" prop="paidAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.paidAmount + '$' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账期" prop="currentPeriod">
            <template slot-scope="scope">
              <div v-for="(good, index) in scope.row.orderDetailVos" :key="index">
                <span class="text-active">{{ good.paidCount || 0 }}</span><span class="total-bill">{{ '/'+ (good.billCount || 0) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | orderStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160px">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="goDetail(scope.row)">查看</el-button>
              <el-button v-if="scope.row.status === 10041" type="primary" plain @click="pushSingle(scope.row)">发货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </div>
    <send-goods :show="sendDialog" :loading="loading" :data-source="commonData" @handClose="closeDialog" @handleOk="submit"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index'
import orderApi from '@/api/order/order.js'
import sendGoods from './components/sendGoods'
import exportExcel from '../../../utils/xlsx.js'
import { saveParameter } from '@/utils/saveParameter.js'
import { orderStatusFilter } from '@/filters/index'
export default {
  components: {
    pagination,
    sendGoods
  },
  data() {
    return {
      orderNo: '',
      loading: false,
      sendDialog: false,
      exporting: false,
      query: {
        statusList: '',
        orderNo: '',
        supplierKeyword: '',
        supplierMode: '["DELIVER"]'
      },
      tempSearch: {
        statusList: '',
        orderNo: '',
        supplierKeyword: '',
        supplierMode: '["DELIVER"]'
      },
      total: 0,
      orderData: [],
      commonData: {},
      listQuery: {
        page: 1,
        pageSize: 10
      }
    };
  },
  watch: {},
  mounted() {
    if (sessionStorage.getItem('pageFlag') && sessionStorage.getItem('path') === this.$route.path) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.tempSearch = {
        ...parameter
      };
      this.query = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      };
    }
    this.getList();
  },
  methods: {
    goDetail(row) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.tempSearch),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: row.orderNo
        }
      });
    },
    // 条件查询
    search() {
      this.tempSearch = {
        ...this.query
      };
      this.getList();
    },
    // 点击查询
    // 获取列表数据
    getList() {
      const data = {
        tableEnum: 'ORDER_TABLE',
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        isTest: 'false',
        ...this.tempSearch
      }
      data.statusList = data.statusList ? JSON.parse(data.statusList) : [];
      data.supplierMode = data.supplierMode ? JSON.parse(data.supplierMode) : [];
      orderApi.orderList(data).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.orderData = res.data.list;
          this.total = res.data.totalRecords;
          sessionStorage.removeItem('pageFlag');
        }
      });
    },
    // 订单导出
    exportOrder() {
      const data = {
        tableEnum: 'ORDER_TABLE',
        page: 1,
        pageSize: this.total,
        isTest: 'false',
        ...this.tempSearch
      }
      data.statusList = data.statusList ? JSON.parse(data.statusList) : [];
      data.supplierMode = data.supplierMode ? JSON.parse(data.supplierMode) : [];
      this.exporting = true
      orderApi.orderList(data).then(res => {
        this.exporting = false
        if (res.code === 200) {
          const json = res.data.list.map(item => {
            const orderDtl = item.orderDetailVos[0]
            return {
              '订单号': item.orderNo,
              '订单时间': item.createTime,
              '店铺': item.ordersProductInfo[0].merchant ? JSON.parse(item.ordersProductInfo[0].merchant).name : '--',
              '商品': orderDtl.productInfo.name,
              '数量': orderDtl.productInfo.count,
              '订单金额': orderDtl.totalRent + '$',
              '优惠金额': orderDtl.apportionDiscount + '$',
              '应付金额': orderDtl.payableAmount + '$',
              '已付金额': item.paidAmount + '$',
              '账期': (orderDtl.paidCount || '0') + '/' + orderDtl.billCount,
              '订单状态': this.orderStatusFilter(item.status)
            }
          })
          // 前端导出
          exportExcel(json, `订单${new Date().Format('yyyyMMdd')}.xlsx`)
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    timeFilter(val) {
      if (!val) return ''
      return val.split('T')[0] + ' ' + val.split('T')[1].slice(0, 8)
    },
    // 新增信息提交
    submit(val) {
      const data = {
        expressType: 'SEND',
        expCompany: val.expCompany,
        oid: val.oid,
        expCode: val.expCode
      }
      orderApi.createExpress(data).then(res => {
        console.log('维护物流res', res);
        if (res.code === 200) {
          const _this = this
          this.loading = true
          setTimeout(function() {
            _this.$message.success('发货成功！');
            _this.sendDialog = false;
            _this.getList()
          }, 2000)
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 发货弹窗
    pushSingle(row) {
      this.sendDialog = true;
      this.commonData = {
        ...row
      };
    },
    // 关闭弹窗
    closeDialog(val) {
      this.sendDialog = val;
    },
    // 切换审核状态
    selectStatus() {
      this.search();
    },
    orderStatusFilter
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.supplier-order-container {
  margin: 15px;
  .supplier-search {
    background-color: #fff;
    padding: 15px;
    margin-bottom: 15px;
    .risk-status-tab {
      margin-bottom: 20px;
      margin-left: 38px;
      .el-radio-button__inner {
        padding: 12px 30px;
        font-size: 14px;
      }
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .erp-content {
    padding: 15px;
    background-color: #fff;
  }
  .search-radio {
    margin-bottom: 10px;
  }
}
</style>
