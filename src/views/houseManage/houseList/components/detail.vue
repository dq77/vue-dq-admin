<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="feelroom-detail-container">
    <el-dialog :visible.sync="dialog" title="房源信息" center width="600px" @close="cancel">
      <div class="title-info">
        <span>基本信息</span>
      </div>
      <table class="base-table">
        <tr>
          <td>房源名称</td>
          <td>{{ houseInfo.name }}</td>
          <td>房源状态</td>
          <td>{{ houseStatus(houseInfo.status) }}</td>
        </tr>
        <tr>
          <td>房源类型</td>
          <td>{{ houseInfo.rentalType | rentalTypeFilter }}</td>
          <td>房源地址</td>
          <td v-if="houseInfo.address">
            {{ houseInfo.address.indexAndDetail[1] }}
            {{ houseInfo.address.indexAndDetail[2] }}
            {{ houseInfo.address.indexAndDetail[3] }}
            {{ houseInfo.address.districts[1].name }}
          </td>
        </tr>
        <tr>
          <td>经纪人</td>
          <td>{{ disposeBrokerId(houseInfo.brokerId) }}</td>
          <td>淘租公服务</td>
          <td>{{ houseInfo.customerService ? '是' :"否" }}</td>
        </tr>
        <tr>
          <td>房源标签</td>
          <td>
            <el-tag v-for="item in houseInfo.tag ? JSON.parse(houseInfo.tag): []" :key="item">{{ item }}</el-tag>
          </td>
          <td>权重</td>
          <td>{{ houseInfo.weight }}</td>
        </tr>
        <tr>
          <td>展示图</td>
          <td colspan="3">
            <el-popover
              v-for="item in houseInfo.preview ? JSON.parse(houseInfo.preview): []"
              :key="item"
              trigger="hover"
              placement="top-start"
              style="margin-right:10px;"
            >
              <img slot="reference" :src="item" width="100px;" height="80px;" >
              <img :src="item" width="240px" height="144px" >
            </el-popover>
          </td>
        </tr>
        <tr>
          <td>{{ houseInfo.rentalType === 3 ? '交接日期' : '入住时间' }}</td>
          <td>{{ houseInfo.moveInDate }}</td>
          <td>{{ houseInfo.rentalType === 3 ? '' : '租期要求' }}</td>
          <td>{{ houseInfo.rentalType === 3 ? '' : houseInfo.leaseRequire }}</td>
        </tr>
        <tr>
          <td>使用面积</td>
          <td>{{ houseInfo.dimensions }}英尺²</td>
          <td>房间情况</td>
          <td>{{ houseInfo.condition }}</td>
        </tr>
        <tr>
          <td>物业类型</td>
          <td>{{ houseInfo.propertyType }}</td>
          <td>水电气网</td>
          <td>{{ houseInfo.waterAndElectricity }}</td>
        </tr>
        <tr>
          <td>基础设施</td>
          <td>{{ houseInfo.infrastructure ? JSON.parse(houseInfo.infrastructure).join(' ') : '' }}</td>
          <td>周边环境</td>
          <td>{{ houseInfo.environment ? JSON.parse(houseInfo.environment).join(' ') : '' }}</td>
        </tr>
        <tr v-if="houseInfo.rentalType !== 3">
          <td>出租对象</td>
          <td>{{ houseInfo.target }}</td>
          <td>房客要求</td>
          <td>{{ houseInfo.homeRequire }}</td>
        </tr>
        <tr>
          <td>交叉路口</td>
          <td>{{ houseInfo.intersection }}</td>
          <td>楼层</td>
          <td>{{ houseInfo.floor }}</td>
        </tr>
        <tr>
          <td>详细信息</td>
          <td colspan="3">{{ houseInfo.detail }}</td>
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
import {
  rqHourseInfo // 查询单个房源
} from '@/api/Listings/Listings';
import {
  rqBrokerList // 分页查询
} from '@/api/broker/index';
export default {
  components: {},
  filters: {
    rentalTypeFilter(value) {
      switch (value) {
        case 1:
          return '整租';
        case 2:
          return '合租';
        case 3:
          return '售卖';
      }
    }
  },
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
      houseInfo: {},
      BrokerList: []
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val && this.dataSource.id) {
          this.getDetail(this.dataSource.id);
          this.getLogList();
          this.fetchBrokerList();
        }
      }
    }
  },
  methods: {
    getDetail(id) {
      rqHourseInfo({ id }).then(res => {
        if (res.code === 200) {
          this.houseInfo = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 日志
    getLogList() {},

    // 关闭弹窗
    cancel() {
      this.$emit('handClose', false);
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
    },

    // 状态
    houseStatus(status) {
      switch (status * 1) {
        case 1:
          return '寻租中';
        case 2:
          return '出租中';
        case 3:
          return '已下架';
      }
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
