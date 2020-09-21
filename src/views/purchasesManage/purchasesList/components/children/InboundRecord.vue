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
          prop: 'stockInNo',
          label: this.$t('warehouse.instockid')
        },
        {
          prop: 'goods',
          label: this.$t('good.good'),
          render: row => {
            return (
              <div>
                {row.goods.map(item => (
                  <span>
                    <span>{item.name}</span>
                    <span>{`*${item.quantity}`}</span>
                  </span>
                ))}
              </div>
            );
          }
        },
        {
          prop: 'stockInWarehouse_name',
          label: this.$t('warehouse.instockwarehouse'),
          render: row => (
            <span>{row.stockInWarehouse && row.stockInWarehouse.name}</span>
          )
        },
        {
          prop: 'skudid',
          label: this.$t('warehouse.instockstatus'),
          render: row => {
            let text = '';
            switch (row.status) {
              case 'SUBMITTED':
                text = this.$t('warehouse.waitforinstock');
                break;
              case 'COMPLETED':
                text = this.$t('warehouse.isinstock');
                break;
              default:
                text = '--';
                break;
            }
            return <el-tag>{text}</el-tag>;
          }
        },
        {
          prop: 'stockInTime',
          label: this.$t('warehouse.instocktime')
        },
        {
          prop: 'skudid',
          label: this.$t('warehouse.instockrecord'),
          render: row => (
            <span>{row.stockInWarehouse && row.operator.name}</span>
          )
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
