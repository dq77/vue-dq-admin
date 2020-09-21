<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-10 13:57:00
 * @Description: file content
 -->
<template>
  <div class="agentlist-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="姓名：">
          <el-input v-model="queryForm.name" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="queryForm.contactNumber" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="入驻时间：">
          <el-date-picker
            v-model="timeArr"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择入驻时间"
            @change="getTime"
          />
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="agentlist-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="经纪人编号" prop="id" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="合作状态" prop="brokerStatus" width="90px" align="center">
          <template slot-scope="scope" align="center">
            <el-tag v-if="scope.row.status===2">
              <span>合作中</span>
            </el-tag>
            <el-tag v-if="scope.row.status===3" type="danger">
              <span>合作停止</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户手机号" prop="contactNumber" align="center" />
        <el-table-column label="用户邮箱" prop="emailAddress" align="center"/>
        <!-- <el-table-column label="服务类型" prop="brokerServices" align="center">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.brokerServices" :key="item" style="margin:5px;">{{ brokerServices(item) }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="入驻时间" prop="applicationTime" align="center" show-overflow-tooltip />
        <el-table-column label="操作" min-width="168px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
            <el-button type="primary" plain icon="el-icon-view" @click="view(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status ===2" type="danger" plain icon="el-icon-view" @click="changeState(scope.row)">停止合作</el-button>
            <el-button v-if="scope.row.status ===3" type="success" plain icon="el-icon-view" @click="changeState(scope.row)">开始合作</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
    <detail :show="viewDialog" :data-source="commonData" @handClose="closeDetail" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import detail from './components/detail';
import { saveParameter } from '@/utils/saveParameter.js';
import {
  rqBrokerList, // 分页查询
  rqBrokerListenable, // 启用经纪人
  rqBrokerListdisenable // 禁用机器人
} from '@/api/broker/index';
export default {
  components: {
    pagination,
    detail
  },
  data() {
    return {
      queryForm: {
        contactNumber: '', // 手机号
        name: '', // 姓名
        applicationTimeFrom: '', // 起始时间
        applicationTimeTo: '' // 截止时间
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      timeArr: '',
      commonData: {}, // 详情数据
      viewDialog: false // 详情弹窗
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表信息
    getList() {
      const data = {
        page: this.listQuery.page,
        size: this.listQuery.pageSize,
        ...this.queryForm
      };
      rqBrokerList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list || [];
          this.total = res.data.totalRecords;
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

    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
    },

    // 新增
    add() {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.queryForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'agentDetail'
      });
    },

    // 编辑
    edit(row) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.queryForm),
        JSON.stringify(this.listQuery)
      );
      const query = { id: row.id };
      this.$router.push({
        name: 'agentDetail',
        query
      });
    },

    // 修改合作状态
    changeState(row) {
      const change = row.status * 1 === 2 ? '停止' : '开始';
      const text = `是否确认与当前经纪人"${row.name}"${change}合作?`;
      this.$confirm(text, `确认${change}合作`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(_ => {
          const params = {
            brokerId: row.id,
            version: row.version
          };
          if (change === '开始') {
            rqBrokerListenable({ ...params }).then(res => {
              this.getList();
            });
          } else {
            rqBrokerListdisenable({ ...params }).then(res => {
              this.getList();
            });
          }
          // done();
        })
        .catch(_ => {});
    },

    // 时间选择
    getTime(value) {
      this.queryForm.applicationTimeFrom = value ? value[0] : '';
      this.queryForm.applicationTimeTo = value ? value[1] : '';
    },

    //
    brokerServices(brokerServices) {
      switch (brokerServices * 1) {
        case 0:
          return '申请房屋staging';
        case 1:
          return '发布房源';
        case 2:
          return '申请代租托管';
      }
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.agentlist-container {
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
  .agentlist-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
