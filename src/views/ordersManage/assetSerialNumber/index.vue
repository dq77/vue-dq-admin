<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 16:26:57
 * @LastEditors: your name
 * @LastEditTime: 2019-03-05 09:47:51
 -->
<template>
  <div class="assets-container">
    <!-- 搜索框 -->
    <el-card class="searchOption" shadow="never">
      <el-form :model="params" :inline="true">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="绑定状态">
              <el-select v-model="params.snBindStatus" placeholder="请选择绑定状态" class="input-200">
                <el-option label="全部" value=""/>
                <el-option label="未绑定" value="0"/>
                <el-option label="已绑定" value="1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单号">
              <el-input v-model="params.orderNo" placeholder="请输入订单号" class="input-200"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="text-align:right;">
        <el-button type="primary" icon="el-icon-search" @click="searchtable">查询</el-button>
        <el-button type="primary" @click="batchAdd"><svg-icon icon-class="bachadd" /> 批量绑定</el-button>
      </el-row>
    </el-card>
    <!-- 表格 -->
    <div class="content">
      <div ref="tableContent" class="table-wrap">
        <el-table
          :max-height="height"
          :data="tableData"
          border
          stripe
          style="width: 100%">
          <el-table-column label="订单号" align="center" prop="no" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:;" class="a" @click="toOrderDetail(scope.row)">
                {{ scope.row.orderNo }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="渠道" align="center" prop="channel" width="80">
            <template slot-scope="scope">
              <span >{{ scope.row.list[0].channel | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="SKU信息" align="center" prop="skuid" class-name="eltablecolumnStyle" show-overflow-tooltip>
            <template slot-scope="scope" >
              <ul>
                <li v-for="item in scope.row.list" :key="item.oid" >商品名称：{{ item.productName || '暂无信息' }}</li>
                <li v-for="item in scope.row.list" :key="item.oid" >sku：{{ item.skuContent || '暂无信息' }}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" align="center" prop="orderStatus" class-name="eltablecolumnStyle" show-overflow-tooltip>
            <template slot-scope="scope">
              <ul>
                <li v-for="item in scope.row.list" :key="item.oid">
                  {{ item.status | orderStatusFilter }}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" align="center" prop="createTime" show-overflow-tooltip>
            <template slot-scope="scope">
              <span >{{ scope.row.list[0].createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" prop="snList">
            <template slot-scope="scope" >
              <div v-if="scope.row.edit" class="edit-div">
                <el-input v-model="scope.row.bd" class="table-input-edit" placeholder="序列号"/>
                <i class="el-icon-circle-check-outline editBtn green" @click="handokEdit(scope.row)" />
                <i class="el-icon-circle-close-outline editBtn red" @click="handlecancel(scope.row)" />
              </div>
              <div v-else>
                <div v-if="scope.row.list.length===1 && scope.row.list[0].snList" class="edit-div">
                  <el-tooltip :content="scope.row.list[0].snList[0]" placement="top">
                    <span class="edit-text">{{ scope.row.list[0].snList[0] }}</span>
                  </el-tooltip>
                  <i class="el-icon-edit editBtn" @click="editbing(scope.row)" />
                </div>
                <el-button v-else type="primary" plain @click="bindClick(scope.row)"><svg-icon icon-class="binding"/> {{ scope.row.list.length > 1 ?'查看绑定' :'绑定' }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="paginationChange"
      />
    </div>
    <!-- 批量新增 -->
    <Batchadd :show="visible" @handOk="handOk" @handCancel="handCancel"/>

    <!-- 绑定序列号 -->
    <Bindsequencenumber :show="bindVisible" :props-data="childData" @handOk="bindSucess" @handCancel="handCancel"/>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination'
import Batchadd from './modal/batchAdd';
import Bindsequencenumber from './modal/bindsequenceNumber'
import {
  fetchadminordersnlist, // 列表
  addSn
} from '@/api/inventorys'
import { channelFilter, orderStatusFilter } from '../../../filters'
import { saveParameter } from '@/utils/saveParameter.js'
export default {
  components: {
    Pagination,
    Batchadd,
    Bindsequencenumber
  },
  filters: {
    channelFilter,
    orderStatusFilter
  },
  data() {
    return {
      visible: false,
      bindVisible: false,
      total: 0, // 总数量
      childData: [],
      height: null,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      tempSearch: {
        snBindStatus: '',
        orderNo: ''
      }, // 点击查询按钮之后，才带条件查询 ，定义个中间量
      tableData: [],
      params: {
        snBindStatus: '',
        orderNo: ''
      }
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.tableContent.offsetHeight - 50;
    })
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.params = {
        ...parameter
      };
      this.tempSearch = {
        ...parameter
      };
      this.listQuery = {
        ...listQuery
      }
    }
    this.fetchtablelist();
  },
  methods: {

    // 获取表格数据
    fetchtablelist() {
      const params = {
        ...this.tempSearch,
        ...this.listQuery
      }
      fetchadminordersnlist({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableData = this.deal(res.data.list) || []
          this.total = res.data.totalCount || 0;

          sessionStorage.removeItem('pageFlag');
          this.listQuery.page = res.data.page;
          this.listQuery.pageSize = res.data.pageSize;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    toOrderDetail(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.listQuery));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: row.orderNo
        }
      })
    },
    // 筛选查询
    searchtable() {
      this.listQuery = {
        page: 1,
        pageSize: 10
      }
      this.tempSearch = {
        ...this.params
      }
      this.fetchtablelist()
    },

    // 处理数据
    deal(arr) {
      const newarr = []
      arr.map(item => {
        item.edit = false
        newarr.push(item)
      })
      return newarr
    },

    // 确认编辑
    handokEdit(row) {
      row.edit = false
      row.originavalue = row.bd
      const params = {
        snVoList: [{
          'orderNo': row.list[0].oid,
          'snList': [row.bd]
        }]
      }
      addSn({ ...params }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.fetchtablelist()
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 取消编辑
    handlecancel(row) {
      row.bd = row.originavalue || row.bd
      row.edit = false
    },

    // 批量绑定
    batchAdd() {
      this.visible = true
    },

    // 表格
    bindClick(row) {
      console.log(row)
      // 如何订单内商品为多个使用弹窗进行绑定
      if (row.list.length > 1) {
        this.childData = row
        this.bindVisible = true
      } else {
        row.edit = !row.edit
      }
    },

    // 编辑按钮
    editbing(row) {
      row.bd = row.list[0].snList[0]
      row.edit = !row.edit
    },

    handOk() {
      this.visible = false
      this.fetchtablelist()
    },

    // 绑定序列号确定
    bindSucess() {
      this.bindVisible = false
    },

    handCancel() {
      this.visible = false
      this.bindVisible = false
    },

    // 分页变化
    paginationChange(val) {
      console.log(val)
      this.fetchtablelist()
    }

  }
}
</script>
<style lang="scss" scoped>
.assets-container {
  padding: 15px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}
.searchOption {
  background:#fff;
  border: 0;
  // height: 115px;
}
.content {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  flex: 1 ;
  background: #fff;
}
.table-wrap {
  flex: 1;
  padding: 15px;
  // overflow: auto;
}
.editBtn{
  margin-left:16px;
  cursor: pointer;
  color: #409EFF;
  font-size: 16px;
}
.table-input-edit{
  width: 100px;
}
.edit-div{
    display: flex;
    align-items: center;
    justify-content: center;
}
.edit-text{
    width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.a{
  color: #4da9ec;
}
</style>

<style lang="scss">
.eltablecolumnStyle{
  padding:0 !important;
  .cell{
    padding: 0 !important;
  }
  li{
    // border-bottom:1px solid #ebeef5;
    padding: 0 10px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  ul li:nth-child(2) {
    color: rgb(150, 150, 150)
  }
}
</style>

