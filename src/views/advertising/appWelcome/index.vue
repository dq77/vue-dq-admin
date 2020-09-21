<template>
  <div class="app-welcome">
    <div class="content">
      <div class="add-btn">
        <el-button
          type="primary"
          @click="addApp()"
        >新增</el-button>
      </div>
      <div class="table-content">
        <el-table
          :data="tableData"
          border
          max-height="600"
        >
          <el-table-column
            label="名称"
            prop="name"
          />
          <el-table-column label="图片">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                trigger="hover"
              >
                <img
                  v-if="scope.row.content"
                  :src="scope.row.basePictureUrl + scope.row.content"
                  style="width:200px;"
                >
                <img
                  v-if="scope.row.content"
                  slot="reference"
                  :src="scope.row.basePictureUrl + scope.row.content"
                  style="height:60px;"
                >
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status === 20"
                type="success"
              >启用</el-tag>
              <el-tag
                v-if="scope.row.status === 10"
                type="info"
              >禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="260px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 10"
                type="success"
                plain
                icon="el-icon-success"
                @click="onShelf(scope.row)"
              >启用</el-button>
              <el-button
                v-if="scope.row.status === 20"
                type="warning"
                plain
                icon="el-icon-error"
                @click="offShelf(scope.row)"
              >禁用</el-button>
              <el-button
                type="info"
                plain
                icon="el-icon-edit"
                @click="eidt(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                @click="delet(scope.row)"
              >删除</el-button>
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
    <zwq-dialog
      :show="appDialog"
      :data-source="obj"
      @handSuccess="submit"
      @handCancel="cancel"
    />
  </div>
</template>

<script>
import zwqDialog from './addApp';
import appApi from '@/api/advertising/app.js';
import pagination from '@/components/Pagination/index.vue';
export default {
  components: {
    'zwq-dialog': zwqDialog,
    pagination
  },
  data() {
    return {
      appDialog: false,
      tableData: [],
      obj: {},
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize
      };
      appApi.APPList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    addApp() {
      this.appDialog = true;
      this.obj = {};
    },
    // 启用
    onShelf(row) {
      appApi.onShelf(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('已启用！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 禁用
    offShelf(row) {
      appApi.offShelf(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('已禁用！');
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    eidt(row) {
      this.appDialog = true;
      this.obj = row;
    },
    submit(val) {
      console.log('确定提交', val);
      if (val.id) {
        this.editAPP(val);
      } else {
        this.addAPP(val);
      }
      // this.appDialog = false;
    },
    // 新增欢迎页
    addAPP(data) {
      appApi.addAPP({ ...data, type: 0 }).then(res => {
        if (res.code === 200) {
          debugger;
          this.$message.success('新增成功！');
          this.appDialog = false;
          this.getList();
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    // 编辑欢迎页
    editAPP(data) {
      appApi.updateAPP(data).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功！');
          this.getList();
          this.appDialog = false;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    delet(row) {
      appApi.deleteAPP(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功！');
          this.getList();
          this.appDialog = false;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    cancel() {
      this.appDialog = false;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.app-welcome {
  margin: 15px;
  padding: 15px;
  background-color: #fff;
  height: calc(100vh - 80px);
  display: flex;
  flex: 1;
  .add-btn {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .table-content {
    flex: 1;
  }
}
</style>
