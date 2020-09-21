<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="feelroomlist-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="体验门店名称：">
          <el-input v-model="queryForm.name" clearable placeholder="请输入体验店" />
        </el-form-item>
        <el-form-item label="体验门店位置：">
          <!-- <el-input v-model="queryForm.address" clearable placeholder="请输入体验店位置" /> -->
          <el-select v-model="queryForm.districtId" :placeholder="$t('warehouse.iptprovince')" clearable>
            <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="营业状态：">
          <el-select v-model="queryForm.status" clearable>
            <el-option value label="全部" />
            <el-option :value="true" label="营业中" />
            <el-option :value="false" label="已停业" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="feelroomlist-table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="体验门店编号" prop="id" />
        <el-table-column label="体验门店名称" prop="name" />
        <el-table-column label="体验门店地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.address">
              <!-- {{ scope.row.address && JSON.parse(scope.row.address).gradeAndDistricts[1] && JSON.parse(scope.row.address).gradeAndDistricts[1].name }}
              {{ scope.row.address && JSON.parse(scope.row.address).detailAndIndex[3] }}
              {{ scope.row.address && JSON.parse(scope.row.address).detailAndIndex[2] }}
              {{ scope.row.address && JSON.parse(scope.row.address).detailAndIndex[1] }}-->
              {{ scope.row.address ? scope.row.address.indexAndDetail[1]:'' }}
              {{ scope.row.address ? scope.row.address.indexAndDetail[2]:'' }}
              {{ scope.row.address ? scope.row.address.indexAndDetail[3]:'' }}
              {{ scope.row.address ? scope.row.address.districts[1] && scope.row.address.districts[1].name :'' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status !== null" :type="scope.row.status === true ? 'success' : 'info'">{{ scope.row.status ? '营业中':'已停业' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="营业时间" prop="openingHours" />
        <el-table-column label="操作" min-width="168px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===false" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status===false" type="danger" plain @click="Delete(scope.row)">删除</el-button>
            <el-button type="primary" plain @click="view(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status" type="danger" plain @click="changeState(scope.row)">停止营业</el-button>
            <el-button v-else type="success" plain @click="changeState(scope.row)">开始营业</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    </div>
    <detail :show="viewDialog" :data-source="commonData" @handClose="closeDetail" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index';
import detail from './components/detail';
import { saveParameter } from '@/utils/saveParameter.js';
import modelRoomApi from '@/api/modelRoom';
import locationList from '@/assets/location/location';

export default {
  components: {
    pagination,
    detail
  },
  data() {
    return {
      queryForm: {
        name: '',
        status: '',
        districtId: ''
      },

      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      tableData: [],
      commonData: {}, // 详情数据
      viewDialog: false, // 详情弹窗
      provinceList: locationList
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
        size: this.listQuery.size,
        ...this.queryForm
      };
      // Object.keys(data).map(item => {
      //   data[item] === '' && delete data[item];
      // });
      modelRoomApi.getRoomList(data).then(res => {
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
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'feelroomDetail'
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
        name: 'feelroomDetail',
        query
      });
    },
    // 修改营业状态
    changeState(row) {
      const change = row.status ? '停止' : '开始';
      const text = `是否确认${change}营业"${row.name}"?`;
      this.$confirm(text, `确认${change}营业`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(_ => {
          modelRoomApi
            .editRemarkStateus({ id: row.id, status: !row.status })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功');
                this.getList();
              } else {
                this.$message.error(res.msg);
              }
            });
          // done();
        })
        .catch(_ => {});
    },

    // 删除个别体验店
    Delete(row) {
      modelRoomApi.deleteShop({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.feelroomlist-container {
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
  .feelroomlist-table {
    padding: 15px;
    background-color: #fff;
  }
}
</style>
