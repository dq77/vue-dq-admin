<template>
  <div class="supplier-log">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>{{ $t('common.actionsLog') }}</span>
      </div>
      <div class="info-content">
        <el-table
          :data="goodsObj"
          border
          style="width:100%"
          max-height="500"
        >
          <el-table-column
            :label="$t('setCenter.time')"
            prop="time"
            align="center"
          />
          <el-table-column
            :label="$t('setCenter.event')"
            prop="desc"
            align="center"
          />
          <el-table-column
            :label="$t('good.actionUser')"
            prop="operatorName"
            align="center"
          />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
// import orderApi from '@/api/order/order.js';
// import billApi from '@/api/order/bill.js';
export default {
  components: {},
  props: {
    goodsObj: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  watch: {
    goodsObj: {
      handler(value) {},
      deep: true
    }
  },
  methods: {}
};
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.supplier-log {
  .box-card {
    .clearfix {
      border-left: 2px solid #2592fc;
      line-height: 16px;
      padding-left: 8px;
    }
    margin-bottom: 16px;
    .title-info {
      padding: 10px 10px 10px 15px;
      border-left: 2px solid #2592fc;
      background-color: #f3f3f3;
    }
  }
}
</style>
