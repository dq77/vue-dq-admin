<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: わからないよう
 * @LastEditTime: 2020-08-10 14:01:23
 * @Description: file content
 -->
<template>
  <div class="agent-detail-container">
    <el-dialog :visible.sync="dialog" title="经纪人详情" center width="600px" @close="cancel">
      <div class="title-info">
        <span>基本信息</span>
      </div>
      <table class="base-table">
        <tr>
          <td>经纪人编号</td>
          <td>{{ dataSource.id }}</td>
          <td>经纪公司</td>
          <td>{{ dataSource.companyName }}</td>
        </tr>
        <tr>
          <td>经纪人姓名</td>
          <td>{{ dataSource.name }}</td>
          <td>入驻时间</td>
          <td>{{ dataSource.applicationTime }}</td>
        </tr>
        <tr>
          <td>余额</td>
          <td>{{ 0 }}</td>
          <td>可提现余额</td>
          <td>{{ 0 }}</td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td>{{ dataSource.emailAddress }}</td>
          <td>电话</td>
          <td>{{ dataSource.contactNumber }}</td>
        </tr>
      </table>
      <div class="title-info">
        <span>操作日志</span>
      </div>
      <el-table :data="tableData" border style="margin-top:15px">
        <el-table-column label="操作时间" prop="time" />
        <el-table-column label="操作内容" prop="operation" />
        <el-table-column label="操作人" prop="operatorName" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  rqBrokerDetail // 详情
} from '@/api/broker/index';
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
      dialog: this.show, // 弹窗标志
      tableData: []
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
      rqBrokerDetail({ id }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
    },

    // languages
    languages(languages) {
      switch (languages * 1) {
        case 0:
          return '汉语';
        case 1:
          return '英语';
        case 2:
          return '法语';
        case 3:
          return '日语';
        case 4:
          return '韩语';
        case 5:
          return '粤语';
      }
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
.agent-detail-container {
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
  .el-tag {
    margin: 0 5px;
  }
}
</style>
