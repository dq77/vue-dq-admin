<template>
  <div class="popup-container pageContent">
    <div class="popup-table">
      <div class="btn-container">
        <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      </div>
      <div class="table-height">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          max-height="600">
          <el-table-column
            fixed
            label="序号"
            width="80">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="渠道">
            <template slot-scope="scope">
              <span>{{ scope.row.channelCode | channelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="图片">
            <template slot-scope="scope">
              <el-popover
                ref="popover"
                placement="right"
                trigger="hover">
                <img :src="scope.row.baseUrl + scope.row.imgUrl" class="previewImage" style="width:300px">
                <img v-if="scope.row.imgUrl" slot="reference" :src="scope.row.baseUrl + scope.row.imgUrl" class="thumbnail">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.activeUrl"><el-tag>活动</el-tag></span>
              <span v-else><el-tag type="success">商品</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 20"><el-tag type="success">启用</el-tag></span>
              <span v-if="scope.row.status == 10"><el-tag type="warning">禁用</el-tag></span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="260">
            <template slot-scope="scope">
              <el-button type="primary" plain icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
              <el-button type="info" plain icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status == 20" type="warning" plain icon="el-icon-error" @click="off(scope.row)">禁用</el-button>
              <el-button v-if="scope.row.status == 10" type="success" plain icon="el-icon-success" @click="off(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList()"/>
    </div>
    <popup-detail :detail-dialog = "detailDialog" :banner-obj="bannerObj" @viewDetail = "viewDetail"/>
    <add-popup :dialog = "dialogVisible" :obj = "obj" @addEvent = "addEvent"/>
  </div>
</template>

<script>
import popupDetail from './popupDetail';
import addPopup from './addPopup';
import popupApi from '@/api/advertising/popup.js'
import pagination from '@/components/Pagination'
export default {
  components: {
    'popup-detail': popupDetail,
    'add-popup': addPopup,
    pagination
  },
  data() {
    return {
      channelList: [],
      channel: '',
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      tableData: [],
      detailDialog: false,
      bannerObj: {},
      obj: {},
      dialogVisible: false
    }
  },
  created() {
    this.getTableList();
  },
  methods: {
    getList() {
      this.getTableList();
    },
    // 获取表格数据
    getTableList() {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize
      }
      popupApi.getPopupList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        }
      })
    },
    // 列表的查看详情
    handleView(value) {
      this.bannerObj = value;
      if (!value.activeUrl) {
        this.bannerObj.type = 0
      } else {
        this.bannerObj.type = 10
      }
      this.detailDialog = true;
    },
    // 关闭查看详情的自定义事件
    viewDetail() {
      this.detailDialog = false;
    },
    // 点击新增按钮
    add() {
      this.obj = {
        type: 0,
        status: 0
      };
      this.obj.flag = 0;
      this.dialogVisible = true;
    },
    // 关闭新增、编辑弹窗的自定义事件
    addEvent(value) {
      this.dialogVisible = false;
      if (value) {
        this.getTableList();
      }
    },
    // 点击编辑按钮
    edit(value) {
      this.obj = JSON.parse(JSON.stringify(value));
      if (this.obj.activeUrl) {
        this.obj.type = 10
      } else {
        this.obj.type = 0
      }
      this.dialogVisible = true;
      this.obj.flag = 1;
    },
    // 启用禁用操作
    off(value) {
      if (value.status === 20) {
        popupApi.offShelf(value.id).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功！');
            this.getTableList();
          } else {
            this.$message.info(res.msg);
          }
        })
      } else {
        popupApi.onShelf(value.id).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功！');
            this.getTableList();
          } else {
            this.$message.info(res.msg);
          }
        })
      }
      // editPopups(data).then(res => {
      //   if (res && res.code === 200) {
      //     this.getTableList();
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup-container {
    padding: 20px;
    .thumbnail {
      width: 80px;
    }
    .btn-container {
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
    }
    .popup-table {
      clear: both;
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;
    }
    .table-height {
      flex: 1;
    }
  }
</style>
