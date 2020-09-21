<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="style-package-container">
    <div class="search-container">
      <el-form :inline="true" label-width="150px">
        <el-form-item label="风格名称：">
          <el-input v-model="searchForm.name" placeholder="请输入风格套餐名称" clearable />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" clearable>
            <el-option value label="全部" />
            <el-option :value="true" label="已上架" />
            <el-option :value="false" label="已下架" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button type="primary" @click="add()">新增</el-button>
      </div>
    </div>
    <div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column label="风格编号" prop="id" align="center" show-overflow-tooltip />
        <el-table-column label="风格名称" prop="name" align="center" show-overflow-tooltip />
        <el-table-column label="权重" prop="weight" align="center" />
        <el-table-column label="状态" prop="status" align="center" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status !== null" :type="scope.row.status ? 'success' : 'info'">{{ scope.row.status ? '上架中':'已下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="gmtCreated" align="center" show-overflow-tooltip />
        <el-table-column label="操作" min-width="168px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==false" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status==false" type="danger" plain @click="Delete(scope.row)">删除</el-button>
            <el-button type="primary" plain @click="view(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status" type="danger" plain icon="el-icon-circle-close-outline" @click="changeState(scope.row)">下架</el-button>
            <el-button v-else type="success" plain icon="el-icon-circle-check-outline" @click="changeState(scope.row)">上架</el-button>
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
  rqstyleHourseList, // 查询风格列表
  rqdeletestyleHourse, // 风格套餐的删除
  rqstyleHourseListStatus // 风格套餐的上下架
} from '@/api/housepackage/index';
export default {
  components: {
    pagination,
    detail
  },
  data() {
    return {
      searchForm: {
        name: '',
        status: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 1,
      tableData: [],
      commonData: {}, // 详情数据
      viewDialog: false, // 详情弹窗
      stateDlg: false, // 房源状态弹窗
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取风格套餐列表信息
    getList() {
      this.loading = true;
      const data = {
        page: this.listQuery.page,
        size: this.listQuery.pageSize,
        ...this.searchForm
      };
      rqstyleHourseList(data).then(res => {
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
    // 修改状态
    changeState(row) {
      const change = row.status ? '下架' : '上架';
      const text = `是否确认${change}"${row.name}"?`;
      this.$confirm(text, `确认${change}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(_ => {
          const params = {
            id: row.id,
            status: !row.status
          };
          rqstyleHourseListStatus({ ...params }).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功');
              row.status = !row.status;
            } else {
              this.$message.error(res.msg);
            }
          });
          // done();
        })
        .catch(_ => {});
    },
    // 关闭详情弹窗
    closeDetail() {
      this.viewDialog = false;
      this.stateDlg = false;
    },

    // 新增
    add() {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$router.push({
        name: 'styleDetail'
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
        name: 'styleDetail',
        query
      });
    },

    // 删除风格套餐
    Delete(row) {
      saveParameter(
        this.$route.path,
        JSON.stringify(this.searchForm),
        JSON.stringify(this.listQuery)
      );
      this.$confirm('确认删除此风格套餐', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
        center: true
      }).then(res => {
        const params = {
          id: row.id
        };
        rqdeletestyleHourse({ ...params }).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功');
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.style-package-container {
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
