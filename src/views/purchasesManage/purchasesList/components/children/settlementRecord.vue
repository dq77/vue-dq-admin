<template>
  <div class="good_main">
    <Table
      :columns="columns"
      :dataSource="tabledata"
      :options="options"
      :fetch="fetchTableData"
      :max-height="options.maxheight"
    />
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
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'id',
          label: this.$t('purchasesManage.settleid')
        },
        {
          prop: 'price',
          label: this.$t('financial.settlesprice')
        },
        {
          prop: 'statusDesc',
          label: this.$t('financial.settlestatus')
        },
        {
          prop: 'settlementTime',
          label: this.$t('financial.settletime')
        },
        {
          prop: 'operator',
          label: this.$t('good.actionUser'),
          render: row => <span>{row.operator && row.operator.name}</span>
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
