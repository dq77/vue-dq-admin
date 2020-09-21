<template>
  <div class="good_main">
    <Table
      :columns="columns"
      :dataSource="tabledata"
      :options="options"
      :fetch="fetchTableData"
      :max-height="options.maxheight"
    />
    <div class="tableText">
      <span>{{ $t('purchasesManage.goodtotalprice') }}:{{ bottominfo.goodsTotalPrice || 0 }}</span>
      <span>{{ $t('purchasesManage.logisticsFee') }}:{{ bottominfo.logisticsFee || 0 }}</span>
      <span>{{ $t('purchasesManage.calculatetotalnum') }}:{{ bottominfo.goodsQuantity || 0 }}</span>
      <span>{{ $t('purchasesManage.calculatetotalprice') }}:{{ bottominfo.purchaseTotalPrice || 0 }}</span>
    </div>
  </div>
</template>

<script>
import Table from '@/components/tableList/tableList';

export default {
  components: {
    Table
  },
  props: {
    tabledata: {
      type: Array,
      default: () => []
    },
    bottominfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'skuId',
          label: 'SKUID'
        },
        {
          prop: 'goodsCode',
          label: this.$t('warehouse.goodcode')
        },
        {
          prop: 'specification',
          label: this.$t('warehouse.goodnamespec'),
          render: row => (
            <span>
              {row.name}
              {row.specification}
            </span>
          )
        },
        {
          prop: 'businessType',
          label: this.$t('good.businessTypes')
        },
        {
          prop: 'price',
          label: this.$t('purchasesManage.purchaseoneprice')
        },
        {
          prop: 'quantity',
          label: this.$t('purchasesManage.purchaseamount')
        },
        {
          prop: 'totalPrice',
          label: this.$t('purchasesManage.totalprice')
        },
        {
          prop: 'actuallyCount',
          label: this.$t('purchasesManage.realinstocknum'),
          render: (row, index) => {
            return (
              <span>{ row.actuallyCount ? row.actuallyCount : '--'}</span>
            )
          }
        },
        {
          prop: 'actuallyTotalPrice',
          label: this.$t('purchasesManage.realbesettled'),
          render: (row, index) => {
            return (
              <span>{ row.actuallyTotalPrice ? row.actuallyTotalPrice : '--'}</span>
            )
          }
        }
      ],

      // 表格内容行配置
      options: {
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: true, // 表格动画
        stripe: true, // 是否为斑马纹
        border: true, // 是否拥有边框
        // initTable: true // 是否一挂载就加载数据
        maxheight: 500 // 传值代表表头固定
      }
    };
  },
  created() {},
  mounted() {
    this.fetchTableData();
  },
  methods: {
    //
    fetchTableData() {
      this.options.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.good_main {
  .tableText {
    margin-top: 15px;
    color: #666;
    text-align: right;
    span {
      margin-left: 30px;
    }
  }
}
</style>
