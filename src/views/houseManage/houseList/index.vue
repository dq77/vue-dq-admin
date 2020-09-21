<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 李圆圆
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="houselist-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="房源名称：">
          <el-input v-model="queryForm.name" clearable placeholder="请输入房源名称" />
        </el-form-item>
        <el-form-item label="房源经纪人：">
          <el-select v-model="queryForm.brokerId" clearable filterable placeholder="请输入关键字" popper-class="my-autocomplete">
            <el-option v-for="item in BrokerList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="queryForm.status" clearable>
            <el-option value label="全部" />
            <el-option :value="1" label="寻租中" />
            <el-option :value="2" label="出租中" />
            <el-option :value="3" label="已下架" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="houselist-table">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column label="房源编号" prop="id" show-overflow-tooltip align="center" />
        <el-table-column label="房源名称" prop="name" show-overflow-tooltip align="center" />
        <el-table-column label="房源地址" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.address">
              {{ scope.row.address ? scope.row.address.indexAndDetail[1]:'' }}
              {{ scope.row.address ? scope.row.address.indexAndDetail[2]:'' }}
              {{ scope.row.address ? scope.row.address.indexAndDetail[3]:'' }}
              {{ scope.row.address ? scope.row.address.districts[1] && scope.row.address.districts[1].name :'' }}
              <!-- {{ scope.row.address }} -->
            </span>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="money" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.rentalType !== 3">${{ scope.row.money }} / 月</span>
            <span v-else>${{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" :type="statusType(scope.row.status)">{{ status(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="gmtCreated" show-overflow-tooltip align="center" />
        <el-table-column label="经纪人" prop="brokerId" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ disposeBrokerId(scope.row.brokerId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="300px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 3" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button type="primary" plain @click="view(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status == 3" type="danger" plain @click="Deletes(scope.row)">删除</el-button>
            <el-button v-if="scope.row.rentalType !== 3" type="primary" plain @click="changeState(scope.row)">更改状态</el-button>
            <el-button v-else-if="scope.row.status === 3" type="primary" plain @click="saleStateChange(scope.row)">上架</el-button>
            <el-button v-else-if="scope.row.status === 1" type="danger" plain @click="saleStateChange(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
    <detail :show="viewDialog" :data-source="commonData" @handClose="closeDetail" />
    <change-state :show="stateDlg" :data-source="commonData" @handClose="closeDetail" @handOk="stateChange" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import detail from './components/detail';
import changeState from './components/changeState';
import { saveParameter } from '@/utils/saveParameter.js';
import warehouseApi from '@/api/warehouse/warehouse';
import {
  rqListingsList, // 查询列表
  rqDeletehourse, // 删除房源信息
  rqUpdatehourseStateus //  修改房屋状态
} from '@/api/Listings/Listings';
import {
  rqBrokerList // 分页查询
} from '@/api/broker/index';
export default {
  components: {
    pagination,
    detail,
    changeState
  },
  data() {
    return {
      loading: false,
      queryForm: {
        name: '', // 房源名称
        brokerId: '', // 经纪人ID
        status: '' //  出租状态
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      commonData: {}, // 详情数据
      viewDialog: false, // 详情弹窗
      stateDlg: false, // 房源状态弹窗
      BrokerList: [] // 经纪人列表
    };
  },

  created() {
    this.getList();
    this.fetchBrokerList(); //
  },
  methods: {
    // 房屋状态 显示
    status(val) {
      switch (val * 1) {
        case 1:
          return '已上架';

        case 2:
          return '出租中';

        case 3:
          return '已下架';
      }
    },

    // 房屋状态 显示
    statusType(val) {
      switch (val * 1) {
        case 1:
          return 'primary';

        case 2:
          return 'success';

        case 3:
          return 'danger';
      }
    },
    // 获取列表信息
    getList() {
      this.loading = true;
      const data = {
        page: this.listQuery.page,
        size: this.listQuery.pageSize,
        ...this.queryForm
      };
      rqListingsList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords;
          this.loading = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 查询条件
    search() {
      this.listQuery.page = 1;
      this.getList();
    },

    // 查看详情
    view(row) {
      this.viewDialog = true;
      this.commonData = {
        ...row
      };
    },

    // 修改房源状态
    changeState(row) {
      this.stateDlg = true;
      this.commonData = {
        ...row
      };
    },

    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
      this.stateDlg = false;
    },
    // 售卖房源上下架操作
    saleStateChange(row) {
      const param = { id: row.id }
      if (row.status === 1) {
        param.afterChangeState = 3
      } else if (row.status === 3) {
        param.afterChangeState = 1
      }
      this.stateChange(param)
    },

    // 确认修改房源状态
    stateChange(val) {
      rqUpdatehourseStateus({ id: val.id, status: val.afterChangeState }).then(
        res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.stateDlg = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        }
      );
    },

    Deletes(row) {
      rqDeletehourse({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.getList();
        } else {
          this.$message.warning(res.msg);
        }
      });
    },

    // 新增
    add() {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'houseDetail'
      });
    },

    // 编辑
    edit(row) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      const query = { id: row.id };
      this.$router.push({
        name: 'houseDetail',
        query
      });
    },

    // 新增信息提交
    submit(val) {
      if (val.id) {
        this.updateWarehouse(val);
      } else {
        this.addWarehouse(val);
      }
    },
    // 编辑
    updateWarehouse(data) {
      warehouseApi.updateWarehouse(data).then(res => {
        if (res.code === 200) {
          this.$message.success('更新成功！');
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 新增
    addWarehouse(data) {
      warehouseApi.addWarehouse(data).then(res => {
        if (res.code === 200) {
          this.$message.success('新增成功！');
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 查询经纪人列表
    fetchBrokerList() {
      const data = {
        page: 1,
        size: 1000,
        name: '',
        phone: '',
        startTime: '',
        endTime: ''
      };
      rqBrokerList(data).then(res => {
        if (res.code === 200) {
          this.BrokerList = res.data.list || [];
        }
      });
    },

    disposeBrokerId(id) {
      let brokerName = '';
      if (this.BrokerList.length > 0) {
        this.BrokerList.map(v => {
          if (id === String(v.id)) {
            brokerName = v.name;
          }
        });
      } else {
        brokerName = '222';
      }
      return brokerName;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.houselist-container {
  padding: 15px;
  .search-container {
    padding: 15px;
    background-color: #fff;
    margin-bottom: 15px;
    .search-btn {
      display: flex;
      justify-content: flex-end;
    }
  }
  .houselist-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
