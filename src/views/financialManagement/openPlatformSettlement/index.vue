<template>
  <div class="page_Content">
    <!-- 上方操作和筛选区 -->
    <el-card class="searchOption" shadow="hover">
      <el-form :model="params" :inline="true">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="订单编号">
              <el-input
                v-model.trim="params.businessNo"
                placeholder="请输入订单编号"
                class="input-200"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称">
              <el-input
                v-model.trim="params.merchantKeyword"
                placeholder="请输入供应商名称"
                class="input-200"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16" style="text-align:right">
          <el-button type="primary" size="small" icon="el-icon-search" @click="seartable">查询</el-button>
        </el-row>
      </el-form>
    </el-card>
    <div class="table-wrap">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="未结算" name="fal">
          <Table
            :columns="columns_fal"
            :dataSource="tableData_fal"
            :options="options_fal"
            :fetch="() => fetchTableData('UNBALANCED')"
            :pagination="pagination"
            :max-height="options_fal.maxheight"
          />
        </el-tab-pane>
        <el-tab-pane label="已结算" name="suc">
          <Table
            :columns="columns_suc"
            :dataSource="tableData_suc"
            :options="options_suc"
            :fetch="() => fetchTableData('SETTLED')"
            :pagination="pagination"
            :max-height="options_suc.maxheight"
          />
        </el-tab-pane>
        <!-- <el-tab-pane
          label="已取消"
          name="cel"
        >
          <Table
            :columns="columnscel"
            :dataSource="tableData_cel"
            :options="options_fal"
            :fetch="() => fetchTableData('')"
            :pagination="pagination"
            :max-height="options_fal.maxheight"
          />
        </el-tab-pane>-->
      </el-tabs>
    </div>
    <settlement-popup
      :show="visible"
      :sourceinfo="sourceinfo"
      @handOk="handOk"
      @handCancel="handCancel"
    />
  </div>
</template>

<script>
import Table from '@/components/tableList/tableList';
import Mallki from '@/components/TextHoverEffect/Mallki';
import settlementPopup from '../settlementPopup/index';
import {
  rqsettltmentsList // 查询列表数据
} from '@/api/financialManagement/index';
export default {
  components: {
    Table,
    Mallki,
    settlementPopup
  },
  data() {
    return {
      visible: false, // 结算弹窗的显示
      params: {
        businessNo: '', // 订单编号
        merchantKeyword: '' // 用户信息
      },
      activeName: 'fal', // 默认的选项卡
      // 已结算表格头部配置
      columns_fal: [
        {
          prop: 'name',
          label: '供应商名称',
          render: row => <span>{row.customer && row.customer.name}</span>
        },
        {
          prop: 'goodName',
          label: '结算方式',
          width: 150,
          render: row => (
            <span>
              {row.settlementStrategy &&
                row.settlementStrategy.supplierModeDesc}
              <strong style='color:#409EFF; margin: 0 5px;'>/</strong>
              {row.settlementStrategy &&
                row.settlementStrategy.baseTimeStrategyDesc}
              <strong style='color:#409EFF; margin: 0 5px;'>/</strong>
              {row.settlementStrategy &&
              row.settlementStrategy.accountPeriodType === 'AFTER_TRANSACTION'
                ? `按 T+${row.settlementStrategy.periodDate}结算`
                : `按每月${row.settlementStrategy.periodDate}号结算`}
            </span>
          )
        },
        {
          prop: 'supplier',
          label: '订单',
          render: (row, index) => {
            return <span style='color:#5a8def'>{row.businessNo}</span>;
          }
        },
        {
          prop: 'goodName',
          label: '商品',
          render: (row, index) => {
            return (
              <div>
                <el-popover
                  placement='top-start'
                  // title='标题'
                  width='200'
                  trigger='hover'
                  // content='这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
                >
                  <ul>
                    {row.goodsLists &&
                      row.goodsLists.length > 0 &&
                      row.goodsLists.map(item => (
                        <li>
                          {item.name}×{item.quantity}
                          {item.specification ? (
                            <strong style='color:#409EFF; margin: 0 5px;'>
                              /
                            </strong>
                          ) : (
                            ''
                          )}
                          {item.specification}
                        </li>
                      ))}
                  </ul>
                  <span style='color:#5a8def' slot='reference'>
                    {(row.goodsLists &&
                      row.goodsLists.length > 0 &&
                      row.goodsLists[0].name) ||
                      ''}
                    {`× ${row.goodsLists.length > 0 &&
                      row.goodsLists[0].quantity}`}
                    {row.goodsLists && row.goodsLists.length > 1 && '...'}
                  </span>
                </el-popover>
              </div>
            );
          }
        },
        {
          prop: 'goodsTotalPrice',
          label: '结算账单金额(¥)'
        },
        {
          prop: 'servicePrice',
          label: '平台服务费'
        },
        {
          prop: 'expectedSettlementPrice',
          label: '应结算金额'
        },
        {
          prop: 'expectedSettlementDate',
          label: '应结算日期'
        },
        {
          prop: 'statusDesc',
          label: '状态'
        },
        {
          prop: 'opertaion',
          label: '操作',
          width: 120,
          render: (row, index) => {
            return (
              <div>
                <el-button
                  style='marginRight:10px;'
                  type='primary'
                  plain
                  onClick={() => this.settlementAmount(row)}
                >
                  结算确认
                </el-button>
                <router-link
                  to={`openPlatformSettlement/settlementDetail/${row.id}`}
                >
                  <el-button type='primary' plain>
                    查看详情
                  </el-button>
                </router-link>
              </div>
            );
          }
        }
      ],
      // 已结算表格头部配置
      columns_suc: [
        {
          prop: 'name',
          label: '供应商名称',
          render: row => <span>{row.customer && row.customer.name}</span>
        },
        {
          prop: 'goodName',
          label: '结算方式',
          width: 150,
          render: row => (
            <span>
              {row.settlementStrategy &&
                row.settlementStrategy.supplierModeDesc}
              <strong style='color:#409EFF; margin: 0 5px;'>/</strong>
              {row.settlementStrategy &&
                row.settlementStrategy.baseTimeStrategyDesc}
              <strong style='color:#409EFF; margin: 0 5px;'>/</strong>
              {row.settlementStrategy &&
              row.settlementStrategy.accountPeriodType === 'AFTER_TRANSACTION'
                ? `按 T+${row.settlementStrategy.periodDate}结算`
                : `按每月${row.settlementStrategy.periodDate}号结算`}
            </span>
          )
        },
        {
          prop: 'supplier',
          label: '订单',
          render: (row, index) => {
            return <span style='color:#5a8def'>{row.businessNo}</span>;
          }
        },
        {
          prop: 'goodName',
          label: '商品',
          render: (row, index) => {
            return (
              <div>
                <el-popover
                  placement='top-start'
                  // title='标题'
                  width='200'
                  trigger='hover'
                  // content='这是一段内容,这是一段内容,这是一段内容,这是一段内容。'
                >
                  <ul>
                    {row.goodsLists &&
                      row.goodsLists.length > 0 &&
                      row.goodsLists.map(item => (
                        <li>
                          {item.name}×{item.quantity}
                          {item.specification ? (
                            <strong style='color:#409EFF; margin: 0 5px;'>
                              /
                            </strong>
                          ) : (
                            ''
                          )}
                          {item.specification}
                        </li>
                      ))}
                  </ul>
                  <span style='color:#5a8def' slot='reference'>
                    {(row.goodsLists &&
                      row.goodsLists.length > 0 &&
                      row.goodsLists[0].name) ||
                      ''}
                    {`× ${row.goodsLists.length > 0 &&
                      row.goodsLists[0].quantity}`}
                    {row.goodsLists && row.goodsLists.length > 1 && '...'}
                  </span>
                </el-popover>
              </div>
            );
          }
        },
        {
          prop: 'expectedSettlementPrice',
          label: '应结算金额'
        },
        {
          prop: 'expectedSettlementDate',
          label: '应结算日期'
        },
        {
          prop: 'settlementPrice',
          label: '实际结算金额'
        },
        {
          prop: 'settlementTime',
          label: '实际结算日期'
        },
        {
          prop: 'statusDesc',
          label: '状态'
        },
        {
          prop: 'opertaion',
          label: '操作',
          render: (row, index) => {
            return (
              <router-link
                to={`openPlatformSettlement/settlementDetail/${row.id}`}
              >
                <el-button type='text'>
                  <mallki class-name='mallki-text' text='查看详情' />
                </el-button>
              </router-link>
            );
          }
        }
      ],
      // 表格内容行配置
      options_suc: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        stripe: true, // 是否为斑马纹
        border: true // 是否拥有边框
        // initTable: true // 是否一挂载就加载数据
        // maxheight: 200 // 传值代表表头固定
      },
      // 表格内容行配置
      options_fal: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        stripe: true, // 是否为斑马纹
        border: true // 是否拥有边框
        // initTable: true // 是否一挂载就加载数据
        // maxheight: 200 // 传值代表表头固定
      },
      // 分页配置
      pagination: {
        total: 1,
        pageIndex: 1,
        pageSize: 10
      },
      // 表格数据
      tableData_suc: [],
      tableData_fal: [],
      tableData_cel: [],
      sourceinfo: {}
    };
  },
  computed: {
    columnscel() {
      const columns_cel = this.columns_fal.slice(0);
      columns_cel.pop();
      columns_cel.push({
        prop: '',
        label: '取消时间'
      });
      return columns_cel;
    }
  },
  watch: {
    activeName() {
      console.log(this.activeName);
      if (this.activeName === 'suc') {
        this.fetchTableData('SETTLED'); // 已结算
      } else if (this.activeName === 'fal') {
        this.fetchTableData('UNBALANCED'); // 结算
      }
    }
  },
  created() {},
  mounted() {
    this.fetchTableData('UNBALANCED'); // 初始请求未结算表格数据
  },
  methods: {
    // 查询
    seartable() {
      this.pagination = {
        pageIndex: 1,
        pageSize: 10
      };
      if (this.activeName === 'fal') {
        this.fetchTableData('UNBALANCED');
      } else if (this.activeName === 'suc') {
        this.fetchTableData('SETTLED');
      }
    },

    // 获取表格数据
    fetchTableData(status) {
      if (status === 'UNBALANCED') {
        this.options_fal.loading = true;
      } else if (status === 'SETTLED') {
        this.options_suc.loading = true;
      }
      const params = {
        ...this.params,
        page: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
        status: status, // 结算状态(UNBALANCED-待结算，SETTLED-已结算)
        byOperator: false, // 是否手工建单
        supplierMode: 'SELLING' // 结算来源SUPPLY-采购，DELIVER-代发，SELLING-代租售
      };
      rqsettltmentsList({ ...params }).then(res => {
        if (res.code === 200) {
          if (this.activeName === 'fal') {
            // 未结算
            this.options_fal.loading = false;
            this.tableData_fal = res.data.list || [];
          } else if (this.activeName === 'suc') {
            // 已结算
            this.options_suc.loading = false;
            this.tableData_suc = res.data.list || [];
          }
          this.pagination.total = res.data.totalRecords || 0;
        }
      });
    },

    // 弹窗的确定回调
    handOk() {
      this.visible = false;
      if (this.activeName === 'fal') {
        this.fetchTableData('UNBALANCED');
      } else if (this.activeName === 'suc') {
        this.fetchTableData('SETTLED');
      }
      this.visible = false;
    },

    // 弹窗的取消回调
    handCancel() {
      this.visible = false;
    },

    // 结算金额
    settlementAmount(row) {
      this.sourceinfo = {
        id: row.id,
        expectedSettlementDate: row.expectedSettlementDate,
        expectedSettlementPrice: row.expectedSettlementPrice,
        version: row.version, // 版本号
        source: 'SELLING' // 弹窗来源
      };
      this.visible = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.page_Content {
  padding: 15px;
}
.searchOption {
  background: #fff;
  // height: 115px;
  margin-bottom: 15px;
}
.table-wrap {
  padding: 15px 15px 0px 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #fff;
  border: 1px solid #ebeef5;
}
.content {
  margin-top: 16px;
  flex: 1;
  background: #fff;
}
</style>
