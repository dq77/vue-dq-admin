<template>
  <div class="feed-back">
    <div class="query">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="query.mobile" class="input-200" placeholder="请填写手机号"/>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="query.channel">
            <el-option
              v-for="(item, index) in channelList"
              :key="index"
              :value="item.code"
              :label="item.name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="feedData" border max-height="600">
        <el-table-column label="用户渠道" prop="channel"/>
        <el-table-column label="意见" prop="suggest"/>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.pictures" :key="index">
              <el-popover trigger="hover" placement="top-start">
                <img :src="item" style="width: 200px;">
                <img slot="reference" :src="item" style="width: 60px;height:60px;">
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="mobile"/>
        <el-table-column label="创建时间" prop="gmtCreate"/>
        <el-table-column label="用户信息">
          <template slot-scope="scope">
            <div><span>姓名：</span>{{ scope.row.username }}</div>
            <div><span>登录手机号：</span>{{ scope.row.regMobile }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import feedApi from '@/api/feedBack.js'
import goodsApi from '@/api/goods.js'
export default {
  components: {
    pagination
  },
  data() {
    return {
      query: {
        channel: '',
        mobile: ''
      },
      channelList: [], // 渠道下拉框
      total: 0,
      listQuery: {
        pageSize: 10,
        page: 1
      },
      tempQuery: {
        channel: '',
        mobile: ''
      },
      feedData: [] // 表格数据
    }
  },
  created() {
    this.getChannelList();
    this.getList();
  },
  methods: {
    // 获取渠道下拉框
    getChannelList() {
      goodsApi.getChannel().then(res => {
        if (res.code === 200) {
          this.channelList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        mobile: this.tempQuery.mobile,
        channel: this.tempQuery.channel
      }
      feedApi.getFeedList(data).then(res => {
        if (res.code === 200) {
          this.feedData = res.data.list;
          this.total = res.data.totalCount;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 点击查询按钮
    search() {
      this.page = 1;
      this.pageSize = 10;
      this.tempQuery = {
        ...this.query
      };
      this.getList();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.feed-back {
  margin: 15px;
  .query {
    padding: 15px;
    background-color: #fff;
  }
  .search-btn {
    display: flex;
    justify-content: flex-end;
  }
  .table {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
  }
  .pagination-container {
    margin-top: 0;
  }
}
</style>
