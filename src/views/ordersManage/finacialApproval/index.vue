<!--
 * @Author: 刁琪
 * @Date: 2019-01-14 16:26:57
 * @LastEditors: your name
 * @LastEditTime: 2019-01-16 11:28:07
 -->
<template>
  <div class="finacial-approval">
    <!-- 上方搜索框 -->
    <el-card class="searchOption" shadow="never">
      <el-form :model="params" :inline="true" label-width="100px">
        <el-form-item label="退货单状态">
          <el-select v-model="params.refundStatusList" placeholder="请选择退货订单状态" clearable class="input-200">
            <el-option :label="`全部(${count[0]})`" value=""/>
            <el-option :label="`待财务审核(${count[1]})`" value="[10112]"/>
            <!-- <el-option :label="`待财务确认退收款(${count[2]})`" value="[10113]"/> -->
            <el-option :label="`退货单已取消(${count[3]})`" value="[10114]"/>
            <el-option :label="`退货单已完成(${count[4]})`" value="[10115]"/>
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
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="timeList"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="getTime"/>
        </el-form-item>
        <el-form-item label="退货来源">
          <el-select v-model="params.createType" class="input-200" clearable>
            <el-option value="" label="全部"/>
            <el-option value="SELLER_REFUND" label="客服创建"/>
            <el-option value="RISK_REFUND" label="风控拒绝"/>
          </el-select>
        </el-form-item>
        <el-form-item label="退货时间">
          <el-date-picker
            v-model="returnTime"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="getReturnTime"/>
        </el-form-item>
        <el-row>
          <el-col style="text-align: right;">
            <el-button type="primary" icon="el-icon-search" @click="seartable">查询</el-button>
            <el-button type="primary" icon="el-icon-download" @click="derivetable">导出</el-button>
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
        :fetch="getList"
        :pagination="pagination"
        :max-height="options.maxheight"
      />
    </div>
    <form id="hiddenForm" ref="hiddenForm" :action="`${baseurl}/refund/return_goods/export`" method="post" style="display:none" target="targetIfr">
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
      baseurl: baseUrl,
      count: [0, 0, 0, 0, 0],
      params: {
        createType: '',
        refundNo: '',
        refundStatusList: '[10112]'
      },
      tempSearch: {
        createType: '',
        refundNo: '',
        refundStatusList: '[10112]'
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
          label: '创建类型',
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
          prop: 'poundageType',
          label: '退收款类型',
          render: (row, index) => {
            if (row.poundageType === 'RECIEVE') {
              return <span>收款</span>
            } else if (row.poundageType === 'REFUND') {
              return <span>退款</span>
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
          prop: 'refundStatus',
          label: '退货单状态',
          render: (row, index) => {
            return <span>{ refundStatus(row.refundStatus) }</span>
          }
        }, {
          prop: 'opertaion',
          label: '操作',
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
        maxheight: 600 // 传值代表表头固定
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
    this.getCount();
    sessionStorage.setItem('role', 'financial');
  },
  mounted() {
    if (sessionStorage.getItem('pageFlag') && this.$route.path === sessionStorage.getItem('path')) {
      const parameter = JSON.parse(sessionStorage.getItem('parameter'));
      const listQuery = JSON.parse(sessionStorage.getItem('listQuery'));
      this.params = {
        ...parameter
      };
      this.tempSearch = {
        ...parameter
      };
      this.pagination = {
        ...listQuery
      }
      this.timeList = [parameter.orderStartTime, parameter.orderEndTime];
      this.returnTime = [parameter.refundStartTime, parameter.refundEndTime];
    }
    this.fetchTableData();
  },
  methods: {
    // 统计数量
    getCount() {
      refundApi.totalCount().then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            switch (item.status) {
              case 10112:
                this.count[0] += item.num;
                this.count[1] += item.num;
                break;
              case 10113:
                this.count[0] += item.num;
                this.count[2] += item.num;
                break;
              case 10114:
                this.count[3] += item.num;
                this.count[0] += item.num;
                break;
              case 10115:
                this.count[4] += item.num;
                this.count[0] += item.num;
                break;
            }
          })
        }
      })
    },
    // 下单时间选择
    getTime(value) {
      this.params.orderStartTime = value ? value[0] : '';
      this.params.orderEndTime = value ? value[1] : '';
    },
    getReturnTime(value) {
      this.params.refundStartTime = value ? value[0] : '';
      this.params.refundEndTime = value ? value[1] : '';
    },
    getList() {
      this.fetchTableData();
    },
    seartable() {
      this.pagination.pageIndex = 1;
      this.pagination.pageSize = 10;
      this.tempSearch = {
        ...this.params
      }
      this.fetchTableData();
    },
    fetchTableData() {
      const data = {
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        ...this.tempSearch
      }
      data.refundStatusList = data.refundStatusList ? JSON.parse(data.refundStatusList) : [10112, 10113, 10114, 10115],
      refundApi.refundList(data).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.totalCount;
          // 每次回到列表页后都把标志清除掉，避免每次都从缓存中读取查询条件
          sessionStorage.removeItem('pageFlag');
          // 当前页的page pageSize赋值给分页组件，不然页码显示不正确
          this.pagination.pageIndex = res.data.page;
          this.pagination.pageSize = res.data.pageSize
        }
      })
    },
    // 查看退货单详情时存入相对应的角色
    viewDetail() {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.pagination));
    },
    // 订单详情页
    orderDetail(row) {
      saveParameter(this.$route.path, JSON.stringify(this.tempSearch), JSON.stringify(this.pagination));
      this.$router.push({
        name: 'orderDetail',
        query: {
          orderNo: row.tid
        }
      })
    },
    // 导出
    derivetable() {
      var form = this.$refs.hiddenForm;
      var input = this.$refs.input;
      const data = {
        refundStatusList: this.params.refundStatusList ? JSON.parse(this.params.refundStatusList) : [10112, 10113, 10114, 10115],
        orderNo: this.params.orderNo,
        refundNo: this.params.refundNo,
        refundNo: this.params.refundNo,
        userKeyWord: this.params.userKeyWord,
        createType: this.params.createType,
        orderEndTime: this.params.orderEndTime,
        orderStartTime: this.params.orderStartTime,
        refundStartTime: this.params.refundStartTime,
        refundEndTime: this.params.refundEndTime
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
.finacial-approval {
  padding: 15px;
}
.el-card {
  border: 0;
}
.searchOption {
  background:#fff;
}
.table-wrap {
  padding: 15px;

}
.content {
  margin-top: 16px;
  background: #fff;
}
a{
color: #4da6d9
}
</style>

