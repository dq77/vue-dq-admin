<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="feelroom-detail-container">
    <el-dialog :visible.sync="dialog" title="样板间信息" center width="600px" @close="cancel">
      <div class="title-info">
        <span>基本信息</span>
      </div>
      <table class="base-table">
        <tr>
          <td>样板间名称</td>
          <td>{{ modelRoomInfo.name }}</td>
          <td>样板间状态</td>
          <td>
            <el-tag :type="modelRoomInfo.status ?'success':'danger'">{{ modelRoomInfo.status ? '营业' : '停业' }}</el-tag>
          </td>
        </tr>
        <tr>
          <td>样板间地址</td>
          <td v-if="modelRoomInfo.address">
            {{ modelRoomInfo.address && modelRoomInfo.address.indexAndDetail[1] }}
            {{ modelRoomInfo.address && modelRoomInfo.address.indexAndDetail[2] }}
            {{ modelRoomInfo.address && modelRoomInfo.address.indexAndDetail[3] }}
            {{ modelRoomInfo.address && modelRoomInfo.address.districts[1].name }}
          </td>
          <td>权重</td>
          <td>{{ modelRoomInfo.weight }}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{ modelRoomInfo.contactNumber }}</td>
          <td>开放时间</td>
          <td>{{ modelRoomInfo.openingHours }}</td>
        </tr>
        <tr>
          <td>展示图</td>
          <td colspan="3">
            <el-popover
              v-for="item in modelRoomInfo.preview ? JSON.parse(modelRoomInfo.preview): []"
              :key="item"
              trigger="hover"
              placement="top-start"
              style="margin-right:10px;"
            >
              <img slot="reference" :src="item" width="100px;" height="80px;" />
              <img :src="item" width="240px" height="144px" />
            </el-popover>
          </td>
        </tr>
      </table>
      <div class="title-info">
        <span>操作日志</span>
      </div>
      <el-table :data="tableData" border style="margin-top:15px">
        <el-table-column label="操作时间" prop="gmtCreated" />
        <el-table-column label="操作内容" prop="name" />
        <el-table-column label="操作人" prop="address.provinceName" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import getRoomDetail from '@/api/modelRoom/index';
export default {
  components: {},
  props: {
    dataSource: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      tableData: [],
      modelRoomInfo: {}
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val && this.dataSource.id) {
          this.getLogList(this.dataSource.id);
        }
      }
    }
  },
  methods: {
    getLogList(id) {
      const data = {
        id: id
      };
      getRoomDetail.getRoomDetail(data).then(res => {
        if (res.code === 200) {
          this.modelRoomInfo = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.feelroom-detail-container {
  .title-info {
    margin-top: -25px;
    padding: 6px 10px 6px 15px;
    border-left: 2px solid #2592fc;
    background-color: #f3f3f3;
  }
  .base-table {
    width: 100%;
    margin: 10px 0 40px;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    tr td {
      text-align: left;
      box-sizing: border-box;
      padding: 6px 0 6px 4px;
      border: 1px solid #ebeef5;
    }
    tr td:nth-of-type(2n + 1) {
      font-weight: bold;
      text-align: right;
      width: 90px;
      padding-right: 4px;
      background: #fafafa;
    }
  }
}
</style>
