<template>
  <div class="erp-container">
    <div class="erp-search">
      <el-form :model="query" :inline="true" label-width="90px">
        <el-form-item label="状态">
          <el-radio-group v-model="query.status" class="search-radio">
            <el-radio-button :label="0">待处理</el-radio-button>
            <el-radio-button :label="1">已处理</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="query.orderNo" clearable placeholder="请输入订单编号"/>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="dateScope"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button v-if="query.status === 0" class="batch-push" type="primary" @click="pushBatch">批量推送</el-button>
      </div>
    </div>
    <div class="content">
      <div class="erp-content">
        <el-table
          key="orderData"
          :data="orderData"
          border
          @selection-change="handleSelectionChange">
          <el-table-column v-if="query.status=='0'" key="selection" type="selection" width="55"/>
          <el-table-column label="订单编号" prop="orderNo">
            <template slot-scope="scope">
              <a href="javascript:;" class="a-color" @click="goDetail(scope.row)">{{ scope.row.orderNo }}</a>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="orderCreateTime">
            <template slot-scope="scope">
              <span>{{ scope.row.orderCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="渠道" prop="channel">
            <template slot-scope="scope">
              <span>{{ scope.row.channel | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="name">
            <template slot-scope="scope">
              <div v-for="(item ,index) in scope.row.ordersProductInfo" :key="index">
                <img :src="scope.row.cover">
                <div>{{ item.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status | orderStatusFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="失败原因" prop="reason"/>
          <el-table-column v-if="query.status === 1" label="手动推送时间" prop="successTime"/>
          <el-table-column v-if="query.status === 0" key="10" label="操作">
            <template slot-scope="scope">
              <el-button v-show="query.status === 0 " type="text" @click="pushSingle(scope.row)">手动推送</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
    </div>

  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import erpApi from '@/api/order/erpPush.js'
import { saveParameter } from '@/utils/saveParameter.js'
export default {
  components: {
    pagination
  },
  data() {
    return {
      orderNo: '',
      query: {
        orderNo: '',
        startTime: '',
        endTime: '',
        status: 0
      },
      tempSearch: {
        orderNo: '',
        startTime: '',
        endTime: '',
        status: 0
      },
      total: 0,
      handleType: '',
      dateScope: [],
      noArr: [],
      orderData: [],
      listQuery: {
        page: 1,
        limit: 10,
      }
    }
  },
  watch: {
    dateScope: {
      handler(val) {
        this.query.startTime = val[0] || '';
        this.query.endTime = val[1] || '';
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && sessionStorage.getItem('path') == this.$route.path) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.tempSearch = {
        ...parameter
      }
      this.query = {
        ...parameter
      }
      this.listQuery = {
        ...listQuery
      }
      this.dateScope = [parameter.startTime, parameter.endTime];
    }
    this.getList();
  },
  methods: {
    goDetail(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: row.orderNo
        }
      })
    },
    // 条件查询
    search() {
      this.tempSearch = {
        ...this.query
      }
      this.getList();
    },
    // 点击查询
    // 获取列表数据
    getList() {
      const data = {
        status: 0,
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        ...this.tempSearch
      }
      erpApi.erpList(data).then(res => {
        if (res.code == 200) {
          this.total = res.data.totalCount;
          this.orderData = res.data.list;

          sessionStorage.removeItem('pageFlag');
          this.listQuery.page = res.data.page;
          this.listQuery.pageSize = res.data.pageSize;
        }
      })
    },
    // 单条推送
    pushSingle(value) {
      this.noArr = [];
      this.noArr.push(value.orderNo);
      this.pushBatch();
    },
    // 批量推送
    pushBatch() {
      if (this.noArr.length < 1) {
        this.$message.warning('请选择批量推送订单');
        return
      }
      erpApi.erpPush(this.noArr).then(res => {
        if (res.code == 200) {
          this.$message.success('推送成功');
          this.noArr = [];
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 状态切换
    handleClick(value) {
    },
    // 批量选择
    handleSelectionChange(value) {
      this.noArr = [];
      value.map((item) => {
        this.noArr.push(item.orderNo);
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .erp-container {
    margin: 15px;
    .erp-search {
      background-color: #fff;
      padding: 15px;
      margin-bottom: 15px;
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
<style lang="scss">
.erp-container {
  .el-tabs__nav {
    margin-left: 25px;
  }
   .el-radio-button {
      margin-right: 10px;
      .el-radio-button__inner {
        border-left: 1px solid #dcdfe6;
        border-radius: 4px;
        box-shadow: 0 0 0 0;
      }
    }
}
</style>
