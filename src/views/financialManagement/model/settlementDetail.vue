<template>
  <div class="pageContent">
    <div class="backBtn">
      <el-button
        icon="el-icon-back"
        type="primary"
        size="medium"
        @click="back()"
      >
        返回
      </el-button>
    </div>
    <div class="main">
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>基本信息</span>
        </div>
        <table
          v-loading="false"
          class="table"
        >
          <tr>
            <td class="table-td-bgcolor">店铺名称</td>
            <td>{{ (dataObj.customer && dataObj.customer.name) || '-' }}</td>
            <td class="table-td-bgcolor">店铺结算方式</td>
            <td>{{ dataObj.settlementStrategy | suppliertimeFilter }}</td>
            <td class="table-td-bgcolor">结算状态</td>
            <td class="blue">{{ dataObj.statusDesc || '--' }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">用户实付</td>
            <td>{{ dataObj.settlementPrice || '-' }}</td>
            <td class="table-td-bgcolor">平台服务费</td>
            <td>{{ dataObj.servicePrice || '-' }}</td>
            <td class="table-td-bgcolor">本期应结</td>
            <td>{{ dataObj.expectedSettlementPrice || '--' }}</td>
          </tr>
          <tr>
            <td class="table-td-bgcolor">创建时间</td>
            <td>{{ dataObj.actionTime || '--' }}</td>
            <td class="table-td-bgcolor">应结算日期</td>
            <td>{{ dataObj.expectedSettlementDate || '--' }}</td>
            <td />
            <td />
          </tr>
        </table>
      </el-card>
      <el-card
        shadow="hover"
        class="Card"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>订单信息</span>
        </div>
        <Table
          :columns="columns"
          :dataSource="tableData"
          :options="options"
          :fetch="fetchTableData"
          :max-height="options.maxheight"
        />
      </el-card>
    </div>
    <SettlementPopup
      :show="visible"
      :sourceinfo="sourceinfo"
      @handOk="handOk"
      @handCancel="handCancel"
    />
  </div>
</template>

<script>
import Table from '@/components/tableList/tableList';
import SettlementPopup from '../settlementPopup/index';
import { rqsettlementsDetail } from '@/api/financialManagement/index';

export default {
  components: {
    Table,
    SettlementPopup
  },
  data() {
    return {
      dataObj: {},
      columns: [
        {
          prop: 'businessNo',
          label: '订单号'
        },
        {
          prop: 'actionTime',
          label: '下单时间'
        },
        {
          prop: 'specification',
          label: '商品名称&规格'
        },
        {
          prop: 'businessType',
          label: '商品业务类型',
          render: row => {
            if (row.businessType === 0) {
              return <el-tag>租赁</el-tag>;
            } else {
              return <el-tag>售卖</el-tag>;
            }
          }
        },
        {
          prop: 'quantity',
          label: '数量'
        },
        {
          prop: 'totalPrice',
          label: '订单金额'
        },
        {
          prop: 'periodCount',
          label: '账单'
        },
        {
          prop: 'paymentAmount',
          label: '本期用户实付'
        },
        {
          prop: 'chargeRate',
          label: '服务费率'
        },
        {
          prop: 'expectedSettlementPrice',
          label: '本期应结'
        }
      ],
      tableData: [],
      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        stripe: true, // 是否为斑马纹
        border: true // 是否拥有边框
        // initTable: true // 是否一挂载就加载数据
        // maxheight: 200 // 传值代表表头固定
      },
      sourceinfo: {}
    };
  },
  created() {},
  mounted() {
    this.fetchTableData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取表格数据
    fetchTableData() {
      this.options.loading = true;
      const id = this.$route.params.id;
      rqsettlementsDetail({ settlementId: id }).then(res => {
        if (res.code === 200) {
          this.options.loading = false;
          this.dataObj = res.data || {};
          this.tableData = (res.data && res.data.goodsList) || [];
        }
      });
    },

    // 结算
    Settlement() {
      this.sourceinfo = {
        id: this.dataObj.id,
        expectedSettlementDate: this.dataObj.expectedSettlementDate,
        expectedSettlementPrice: this.dataObj.expectedSettlementPrice,
        version: this.dataObj.version, // 版本号
        source: 'SELLING' // 弹窗来源
      };
    },

    // 弹窗的确定回调
    handOk() {
      this.visible = false;
      this.fetchTableData();
    },

    // 弹窗的取消回调
    handCancel() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  flex: 1;
  overflow: auto;
}
.backBtn {
  text-align: left;
  margin-bottom: 16px;
}
.table {
  width: 100%;
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  tr td:nth-of-type(1) {
    width: 12%;
  }
  tr td:nth-of-type(2) {
    width: 20%;
  }
  tr td:nth-of-type(3) {
    width: 12%;
  }
}
.table-td-bgcolor {
  background: #fafafa;
}
.table tr td {
  border: 1px solid #ebeef5;
  text-align: center;
  height: 36px;
  font-size: 12px;
  color: #606266;
  padding: 0 6px;
  box-sizing: border-box;
}
.clearfix {
  border-left: 2px solid #2592fc;
  line-height: 16px;
  padding-left: 8px;
}
.Card {
  margin-bottom: 16px;
}
</style>
