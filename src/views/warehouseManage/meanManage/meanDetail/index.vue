<template>
  <div class="pageContent">
    <div class="backBtn">
      <el-button icon="el-icon-back" type="primary" @click="goBack">{{ $t('common.back') }}</el-button>
    </div>
    <div class="main">
      <!-- 资产信息 -->
      <el-card shadow="hover" class="Card">
        <div slot="header" class="clearfix">
          <span>{{ $t('route.meanDetail') }}</span>
        </div>
        <div>
          <table v-loading="loading" class="table">
            <tr>
              <td class="table-td-bgcolor">{{ $t('warehouse.snid') }}</td><td>{{ tableDataOne.sn || '--' }}</td>
              <td class="table-td-bgcolor">{{ $t('common.status') }}</td>
              <td>
                <el-tag>{{ tableDataOne.status | filtrAssestStatus }}</el-tag>
              </td>
              <td class="table-td-bgcolor">{{ $t('good.good') }}</td><td>{{ tableDataOne.goods.name || '--' }}</td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">{{ $t('warehouse.buysupplier') }}</td>
              <td>
                <span v-if="tableDataOne.assetPurchase && tableDataOne.assetPurchase.supplier">
                  {{ tableDataOne.assetPurchase.supplier.name }}
                </span>
                <span v-else>--</span>
              </td>
              <td class="table-td-bgcolor">{{ $t('warehouse.purchaseId') }}</td>
              <td>
                <span v-if="tableDataOne.assetPurchase">{{ tableDataOne.assetPurchase.purchaseNo }}</span>
                <span v-else>--</span>
              </td>
              <td class="table-td-bgcolor">{{ $t('warehouse.purchaseintime') }}</td>
              <td>
                <span v-if="tableDataOne.assetPurchase">{{ tableDataOne.assetPurchase.stockInTime }}</span>
                <span v-else>--</span>
              </td>
            </tr>
            <tr>
              <td class="table-td-bgcolor">{{ $t('warehouse.purchaseprice') }}</td>
              <td>
                <span v-if="tableDataOne.assetPurchase">{{ tableDataOne.assetPurchase.unitPrice }}</span>
                <span v-else>--</span>
              </td>
              <td class="table-td-bgcolor">{{ $t('warehouse.residualValue') }}</td><td>{{ tableDataOne.residualValue ||'--' }}</td>
              <td class="table-td-bgcolor"/><td/>
            </tr>
          </table>
        </div>
      </el-card>
      <!-- 资产变动明细 -->
      <el-Card shadow="hover" class="Card">
        <div slot="header" class="clearfix">
          <span>{{ $t('warehouse.meanchangedtl') }}</span>
        </div>
        <el-table v-loading="loading" :data="tableDataTwo" :max-height="400" border stripe style="width: 100%">
          <el-table-column :label="$t('good.businessTypes')" prop="situationDesc" align="center"/>
          <el-table-column :label="$t('warehouse.stockchangeid')" prop="businessNo" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.businessNo || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.relaorder')" prop="orderNo" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderNo || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.updatetime')" prop="actionTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.actionTime || '--' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-Card>
      <!--  订单交易记录-->
      <el-Card shadow="hover" class="Card">
        <div slot="header" class="clearfix">
          <span>{{ $t('warehouse.orderbsnshistory') }}</span>
        </div>
        <el-table v-loading="loading" :data="tableDataThree" :max-height="400" border stripe style="width: 100%">
          <el-table-column :label="$t('warehouse.tradeno')" prop="tradeNo" align="center">
            <template slot-scope="scope">
              <router-link :to="{ name: 'orderDetail', query: { orderNo: scope.row.tradeNo }}">
                {{ scope.row.tradeNo }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.orderno')" prop="orderNo" align="center"/>
          <el-table-column :label="$t('warehouse.ordertype')" prop="tradeType" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeType === 'Lease'">{{ $t('good.rent') }}</span>
              <span v-if="scope.row.tradeType === 'Sales'">{{ $t('good.sale') }}</span>
              <span v-if="scope.row.tradeType === 'Renewal'">{{ $t('warehouse.renewal') }}</span>
              <span v-if="scope.row.tradeType === 'Buyout'">{{ $t('warehouse.buyout') }}</span>
              <span v-if="scope.row.tradeType === 'Staging'">Staging</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.orderstatus')" prop="status" align="center">
            <template slot-scope="scope">
              <el-tag>
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.buytime')" prop="orderTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good.stage')" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.periodCount }} {{ scope.row.unit }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.orderprice')" prop="orderPrice" align="center"/>
          <el-table-column :label="$t('warehouse.shouldpay')" prop="expectedPaymentAmount" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.expectedPaymentAmount || '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('warehouse.realpay')" prop="actualPaymentAmount" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.actualPaymentAmount || '--' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-Card>
    </div>
  </div>
</template>
<script>
import { getassestDetail } from '@/api/inventorys'

export default {
  data() {
    return {
      loading: true,
      tableDataOne: {
        assetPurchase: {
          supplier: {}
        },
        goods: {}
      },
      tableDataTwo: [],
      tableDataThree: []
    }
  },
  created() {

  },
  mounted() {
    this.fetchinventdetail() // 资产详情
  },
  methods: {

    // 返回
    goBack() {
      this.$router.go(-1)
    },

    // 资产详情
    fetchinventdetail() {
      const params = {
        sn: this.$route.params.sn,
        skuId: this.$route.query.skuId
      }
      getassestDetail({ ...params }).then(res => {
        if (res.code === 200) {
          this.tableDataOne = res.data || {}
          this.tableDataTwo = res.data.changeRecords || []
          this.tableDataThree = res.data.orderInfos || []
        }
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .main{
    flex: 1;
    overflow: auto;
  }
  .backBtn{
    margin-bottom: 16px;
  }
  .table{
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    tr td:nth-of-type(2n-1){
      width: 12%;
    }
  }
  .table-td-bgcolor{
    background: #FAFAFA;
  }
  .table tr td{
      border: 1px solid #ebeef5;
      text-align: center;
      height:36px;
      font-size: 12px;
      color: #606266;
      padding: 0 6px;
      box-sizing: border-box;
    }
  .clearfix{
    border-left: 2px solid #2592FC;
    line-height: 16px;
    padding-left: 8px;
  }
  .Card{
    margin-bottom:16px;
  }
</style>

