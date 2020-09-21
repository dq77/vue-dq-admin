<!--
 * @Author: 刁琪
 * @LastEditors: your name
 * @Date: 2019-02-26 10:07:43
 * @LastEditTime: 2019-02-27 16:01:21
 -->
<template>
  <div class="return-confirm">
    <!-- 上方搜索框 -->
    <el-card class="searchOption" shadow="never">
      <el-form :model="params" :inline="true" label-width="90px">
        <el-form-item label="退货状态">
          <el-select v-model="params.returnStatusList" placeholder="请选择退货状态" clearable class="input-200">
            <el-option :label="`全部(${count[0]})`" value="[10116, 10117, 10118]"/>
            <el-option :label="`待处理(${count[1]})`" value="[10116,10117]"/>
            <el-option :label="`已处理(${count[2]})`" value="[10118]"/>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="params.orderNo" placeholder="请输入订单号" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="退货单号">
          <el-input v-model="params.refundNo" placeholder="请输入退货单号" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="买家">
          <el-input v-model="params.userKeyWord" placeholder="请输入姓名.手机号" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="params.expressNo" placeholder="物流单号" clearable class="input-200"/>
        </el-form-item>
        <el-form-item label="退货来源">
          <el-select v-model="params.createType" class="input-200" clearable>
            <el-option value="" label="全部"/>
            <el-option value="SELLER_REFUND" label="客服创建"/>
            <el-option value="RISK_REFUND" label="风控拒绝"/>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="timeList"
            :default-time="['00:00:00','23:59:59']"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="getTime"
          />
        </el-form-item>
        <el-form-item label="退货时间">
          <el-date-picker
            v-model="returnTime"
            :default-time="['00:00:00','23:59:59']"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="getReturnTime"
          />
        </el-form-item>
        <el-row>
          <el-col style="text-align: right;">
            <el-button type="primary" size="small" icon="el-icon-search" @click="seartable">查询</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" @click="derivetable">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <div class="content table-wrap">
      <Table
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="fetchTableData"
        :pagination="pagination"
        :max-height="options.maxheight"
      />
    </div>
    <form id="hiddenForm" ref="hiddenForm" :action="`${baseUrl}/refund/return_goods/export`" method="post" style="display:none" target="targetIfr">
      <input ref="input">
    </form>
    <iframe name="targetIfr" style="display:none"/>
  </div>
</template>
<script>
import Table from '@/components/tableList/tableList';
import Mallki from '@/components/TextHoverEffect/Mallki'
import refundApi from '@/api/order/refund.js'
import { refundStatus } from '@/filters/index.js'
import { baseUrl } from '@/common/config.js'
import { deepClone } from '@/utils/index.js'
import { channelFilter } from '@/filters/index'
import { saveParameter } from '@/utils/saveParameter.js'
export default {
  components: {
    Table,
    Mallki
  },
  data() {
    return {
      count: [0, 0, 0],
      baseUrl: baseUrl,
      params: {
        createType: '',
        expressNo: '',
        returnStatusList: '[10116,10117]'
      },
      tempSearch: {
        createType: '',
        expressNo: '',
        returnStatusList: '[10116,10117]'
      },
      timeList: [],
      returnTime: [],
      // 表格头部配置
      columns: [
        {
          prop: 'refundNo',
          label: '退货订单'
        },
        {
          prop: 'tid',
          label: '订单号',
          render: (row, index) => {
            return (
              <a href='javascript:;' onClick={this.orderDetail.bind(this, row)}>
                {row.tid}
              </a>
            )
          }
        },
        {
          prop: 'skuContent',
          label: '商品'
        },
        {
          prop: 'channel',
          label: '渠道',
          render: (row, index) => {
            return <span>{channelFilter(row.orderChannel)}</span>
          }
        },
        {
          prop: 'createType',
          label: '订单来源',
          render: (row, index) => {
            if (row.createType === 'SELLER_REFUND') {
              return <span>客服创建</span>
            } else if (row.createType === 'RISK_REFUND') {
              return <span>风控拒绝</span>
            }
          }
        },
        {
          prop: 'createTime',
          label: '退货时间'
        },
        {
          prop: 'refundReason',
          label: '退货原因'
        }, {
          prop: 'poundageType',
          label: '退收款类型',
          render: (row) => {
            if (row.poundageType === 'REFUND') {
              return <span>退款</span>
            } else if (row.poundageType === 'RECIEVE') {
              return <span>收款</span>
            }
          }
        }, {
          prop: 'poundage',
          label: '退收款金额',
          render: (row, index) => {
            return <span>{ row.poundage + '$'}</span>
          }
        }, {
          prop: 'poundage',
          label: '已付押金',
          render: (row, index) => {
            return <span>{ row.deposit + '$'}</span>
          }
        }, {
          prop: 'poundage',
          label: '已退押金',
          render: (row, index) => {
            return <span>{ row.refundDeposit + '$'}</span>
          }
        }, {
          prop: 'returnStatus',
          label: '退货状态',
          render: (row, index) => {
            if (row.returnStatus === 10116 || row.returnStatus === 10117) {
              return <span>待确认</span>
            } else if (row.returnStatus === 10118) {
              return <span>已回仓</span>
            }
          }
        }, {
          prop: 'opertaion',
          label: '操作',
          fixed: 'right',
          render: (row, index) => {
            return (
              <router-link to={{ name: 'returnOrdersDetail', query: { refundNo: row.refundNo }}}>
                <el-button type='text' onClick={this.viewDetail}>
                  <mallki class-name='mallki-text' text='查看详情'/>
                </el-button>
              </router-link>
            )
          }
        }
      ],
      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        // initTable: true, // 是否一挂载就加载数据
        maxheight: 500 // 传值代表表头固定
      },
      // 分页配置
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: []
    }
  },
  created() {
    sessionStorage.setItem('role', 'store');
    this.getCount();
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const pagination = JSON.parse(sessionStorage.getItem('listQuery'));
      this.pagination = {
        ...pagination
      }
      this.tempSearch = {
        ...parameter
      }
      this.params = {
        ...parameter
      }
      this.returnTime = [parameter.refundStartTime, parameter.refundEndTime];
      this.timeList = [parameter.orderStartTime, parameter.orderEndTime];
    }
    this.fetchTableData();
  },
  methods: {
    // 统计数量
    getCount() {
      refundApi.refundGoodsTotal().then(res => {
        if (res.code === 200) {
          const count = [0, 0, 0];
          res.data.map(item => {
            switch (item.status) {
              case 10116:
                // this.$set(this.count, 0, item.num)
                count[0] += item.num;
                count[1] += item.num;
                break;
              case 10117:
                count[1] += item.num;
                count[0] += item.num;
                break;
              case 10118:
                count[2] += item.num;
                count[0] += item.num;
                break;
            }
          })
          this.$set(this.count, 0, count[0]);
          this.$set(this.count, 1, count[1]);
          this.$set(this.count, 2, count[2]);
        }
      })
    },

    // 下单时间选择
    getTime(value) {
      this.params.orderStartTime = value ? value[0] : '';
      this.params.orderEndTime = value ? value[1] : '';
      console.log('时间选择器', value);
    },

    getReturnTime(value) {
      this.params.refundStartTime = value ? value[0] : '';
      this.params.refundEndTime = value ? value[1] : '';
      console.log('时间选择器', value);
    },

    fetchTableData() {
      const data = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        supplierMode: ['SELLING', 'RENTING'],
        refundStatusList: [10111, 10112, 10115],
        ...this.tempSearch
      }
      data.returnStatusList = typeof (data.returnStatusList) === 'string' ? JSON.parse(data.returnStatusList) : data.returnStatusList;
      refundApi.refundList(data).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.totalCount || 0;

          sessionStorage.removeItem('pageFlag');
          this.pagination.pageIndex = res.data.page;
          this.pagination.pageSize = res.data.pageSize;
        }
      })
    },
    // 查看详情时存入相对应的角色
    viewDetail() {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.pagination))
    },
    // 订单详情页
    orderDetail(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.pagination))
      this.$router.push({
        name: 'orderDetail',
        query: { orderNo: row.tid }
      })
    },
    // 查询
    seartable() {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = 10;
      this.tempSearch = {
        returnStatusList: this.params.returnStatusList,
        orderNo: this.params.orderNo,
        expressNo: this.params.expressNo,
        refundNo: this.params.refundNo,
        userKeyWord: this.params.userKeyWord || '',
        createType: this.params.createType,
        refundStartTime: this.params.refundStartTime,
        refundEndTime: this.params.refundEndTime,
        orderStartTime: this.params.orderStartTime,
        orderEndTime: this.params.orderEndTime
      }
      this.fetchTableData();
    },

    // 导出
    derivetable() {
      var form = this.$refs.hiddenForm;
      var input = this.$refs.input;
      const data = {
        returnStatusList: this.params.returnStatusList ? JSON.parse(this.params.returnStatusList) : [10116, 10117, 10118],
        orderNo: this.params.orderNo,
        refundNo: this.params.refundNo,
        expressNo: this.params.expressNo,
        userKeyWord: this.params.userKeyWord,
        createType: this.params.createType,
        orderStartTime: this.params.orderStartTime,
        orderEndTime: this.params.orderStartTime,
        refundStartTime: this.params.refundStartTime,
        refundEndTime: this.params.refundEndTime,
        refundStatus: 10114
      };
      input.type = 'hidden';
      input.name = 'orderRefundQueryVo';
      input.value = JSON.stringify(data);
      form.submit();
    }
  }
}
</script>
<style lang="scss" scoped>
.return-confirm {
  padding: 15px;
}
.searchOption {
  background:#fff;
  // height: 115px;
}
.table-wrap {
  padding: 15px;
}
.content {
  margin-top: 16px;
  background: #fff;
}
.el-card {
  border: 0;
}
a{
color: #4da6d9
}
</style>

