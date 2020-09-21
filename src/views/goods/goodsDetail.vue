<template>
  <div v-if="detailDialog" class="detail-container" >
    <el-dialog :visible.sync="detailDialog" :title="$t('good.gooddetail')" width="80%" top="0" center @close="closeDialog">
      <div class="goods-info">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header">{{ $t('good.baseInfo') }}</span>
          </div>
          <table class="table">
            <tr>
              <td>{{ $t('good.goodname') }}</td>
              <td>{{ formData.name }}</td>
              <td>{{ $t('good.goodNo') }}</td>
              <td>{{ formData.no }}</td>
              <td>{{ $t('good.goodType') }}</td>
              <td>
                <span v-if="formData.type ===0">{{ $t('good.commongood') }}</span>
                <span v-if="formData.type ===10">{{ $t('good.groupgood') }}</span>
                <span v-if="formData.type ===20">{{ $t('good.consume') }}</span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('good.businessTypes') }}</td>
              <td>
                <span v-if="formData.businessType === 0">{{ $t('good.rent') }}</span>
                <span v-if="formData.businessType === 20">{{ $t('good.sale') }}</span>
              </td>
              <td>{{ $t('good.goodLabel') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>
                <span v-if="formData.label && formData.goodsLabel.length>0">
                  <span v-for="(item,index) in formData.goodsLabel" :key="index">
                    <el-tag type="success">{{ item }}</el-tag>
                  </span>
                </span>
              </td>
              <td>{{ $t('good.channel') }}</td>
              <td>
                <span v-if="formData.channelCode">
                  <span v-for="(item,index) in formData.channelCode" :key="item"><span v-if="index > 0">、</span>{{ item |channelFilter }}</span>
                </span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('good.fromcategory') }}</td>
              <td>{{ formData.categoryLongName }}</td>
              <td>{{ $t('good.categorySort') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>{{ formData.categorySort }}</td>
              <td>{{ $t('good.goodbrand') }}</td>
              <td>{{ formData.brandName }}</td>
            </tr>
            <tr>
              <td>{{ $t('good.labelCategory') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>
                <span v-for="(item,index) in formData.label" :key="index">
                  <el-tag>{{ item }}</el-tag>
                </span>
              </td>
              <td>{{ $t('good.labelsort') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>{{ formData.channelCategorySort }}</td>
              <td>{{ $t('good.authentication') }}</td>
              <td>
                <span v-if="formData.isAuthentication === 0">{{ $t('common.no') }}</span>
                <span v-if="formData.isAuthentication === 10">{{ $t('common.yes') }}</span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('good.istestgood') }}</td>
              <td>
                <span v-if="formData.isTest===0">{{ $t('common.no') }}</span>
                <span v-if="formData.isTest===10">{{ $t('common.yes') }}</span>
              </td>
              <!-- <td>售卖价格</td>
              <td>
                <span>{{ formData.minPrice+'$~' }}{{ formData.maxPrice + '$' }}</span>
              </td> -->
              <td>{{ $t('good.gooddesc') }}</td>
              <td>{{ formData.brief }}</td>
              <td v-if="formData.specificationVOList && (formData.type === 0 || formData.specificationVOList.length > 0)">{{ $t('good.skupic') }}</td>
              <td v-if="formData.specificationVOList && (formData.type === 0 || formData.specificationVOList.length > 0) && !isStaging">
                <span v-for="(item, index) in formData.skuDetailVOList" :key="index">
                  <el-popover
                    trigger="hover"
                    placement="top-start">
                    <img v-if="item.picture" slot="reference" :src="formData.spuBasePictureUrl + item.picture">
                    <img :src="formData.spuBasePictureUrl + item.picture" style="width: 200px">
                  </el-popover>
                </span>
              </td>
              <td v-else>-</td>
            </tr>
            <tr>
              <td>{{ $t('good.gooddetail') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>
                <span v-for="(item, index) in formData.detail" :key="index">
                  <el-popover
                    trigger="hover"
                    placement="top-start">
                    <img slot="reference" :src="formData.spuBasePictureUrl + item">
                    <img :src="formData.spuBasePictureUrl + item" style="width: 200px">
                  </el-popover>
                </span>
              </td>
              <td>{{ $t('good.goodfunc') }}</td>
              <td>
                <span v-for="(item, index) in formData.parameter" :key="index">
                  <el-popover
                    trigger="hover"
                    placement="top-start">
                    <img slot="reference" :src="formData.spuBasePictureUrl + item">
                    <img :src="formData.spuBasePictureUrl + item" style="width: 200px">
                  </el-popover>
                </span>
              </td>
              <td>{{ $t('good.goodserv') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>
                <span v-for="(item, index) in formData.afterSale" :key="index">
                  <el-popover
                    trigger="hover"
                    placement="top-start">
                    <img slot="reference" :src="formData.spuBasePictureUrl + item">
                    <img :src="formData.spuBasePictureUrl + item" style="width: 200px">
                  </el-popover>
                </span>
              </td>
            </tr>
            <tr>
              <td>{{ $t('good.isface') }}</td>
              <td>
                <span v-if="formData.isFace ===0">{{ $t('common.no') }}</span>
                <span v-if="formData.isFace ===1">{{ $t('common.yes') }}</span>
              </td>
              <td>{{ $t('good.isinstall') }}</td>
              <td>
                <span v-if="formData.isInstallation === 0">{{ $t('common.no') }}</span>
                <span v-if="formData.isInstallation === 10">{{ $t('common.yes') }}</span>
              </td>
              <td>{{ $t('good.installprice') }}</td>
              <td v-if="isStaging">-</td>
              <td v-else>
                <span>{{ formData.installationCost + '$' }}</span>
              </td>
            </tr>
            <tr v-if="formData.goodsStrategy">
              <td>{{ $t('good.supplierMode') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.supplierMode != 'SELLING'">{{ $t('good.supply') }}</span>
                <span v-if="formData.goodsStrategy.supplierMode == 'SELLING'">{{ $t('good.selling') }}</span>
              </td>
              <td>{{ $t('good.freightProvider') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.freightServiceProvider == 'YTO'">{{ $t('good.yto') }}</span>
                <span v-else-if="formData.goodsStrategy.freightServiceProvider == 'SFEXPRESS'">{{ $t('good.sfexpress') }}</span>
                <span v-else-if="formData.goodsStrategy.freightServiceProvider == 'PLATFORM'">{{ $t('good.platform') }}</span>
                <span v-else >--</span>
              </td>
              <td>{{ $t('good.isdeliver') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.supplierMode == 'SELLING'">--</span>
                <span v-else-if="formData.goodsStrategy.merchantId">{{ $t('good.canuse') }}</span>
                <span v-else >{{ $t('good.cantuse') }}</span>
              </td>
            </tr>
            <tr v-if="formData.goodsStrategy">
              <td>{{ $t('good.merchant') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.supplierMode == 'DELIVER'">{{ formData.goodsStrategy.merchantName }}</span>
                <span v-else >--</span>
              </td>
              <td>{{ $t('good.salemerchant') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.supplierMode == 'SELLING'">{{ formData.goodsStrategy.merchantName }}</span>
                <span v-else >--</span>
              </td>
              <td>{{ $t('good.chargeRate') }}</td>
              <td>
                <span v-if="formData.goodsStrategy.supplierMode == 'SELLING'">{{ formData.goodsStrategy.chargeRate }}%</span>
                <span v-else >--</span>
              </td>
            </tr>
            <tr v-if="formData.type === 10">
              <td>{{ $t('good.cognatesku') }}</td>
              <td>
                <span v-for="(item,index) in formData.skuRelationShowVoList" :key="index">{{ item }}</span>
              </td>
            </tr>
          </table>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header">{{ $t('good.skuinfo') }}</span>
          </div>
          <el-table :data="formData.skuDetailVOList" border>
            <el-table-column prop="id" label="skuId"/>
            <el-table-column :label="$t('good.specification')">
              <template slot-scope="scope">
                <span>{{ scope.row.detail }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('good.actualStock')" prop="actualStock"/>
            <el-table-column :label="$t('good.erpCode')" prop="erpCode"/>
            <!-- <el-table-column prop="taobaoSkuId" label="淘宝code"/> -->
            <el-table-column :label="$t('good.officialPrice')" prop="officialPrice">
              <template slot-scope="scope">
                <span>{{ scope.row.officialPrice + '$' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="formData.businessType === 20" :label="$t('good.salePrice')" prop="salePrice">
              <template slot-scope="scope">
                <span>{{ scope.row.salePrice + '$' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="formData.businessType === 0" :label="$t('good.basePrice')" prop="base">
              <template slot-scope="scope">
                <span>{{ scope.row.basePrice + '$' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column v-if="formData.businessType === 0" prop="buyoutPrice" label="买断价格">
                <template slot-scope="scope">
                  <span>{{scope.row.buyoutPrice + '$'}}</span>
                </template>
              </el-table-column> -->
            <el-table-column v-if="formData.businessType === 0 && !isStaging" :label="$t('good.depositPrice')" prop="depositPrice">
              <template slot-scope="scope">
                <span>{{ scope.row.depositPrice + '$' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="formData.goodsStrategy && formData.goodsStrategy.supplierMode == 'DELIVER'" :label="$t('good.supplierPrice')">
              <template slot-scope="scope">
                <span>{{ scope.row.supplierSettlementPrice + '$' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="!isStaging" :label="$t('good.stagelist')" prop="stage">
              <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  trigger="hover">
                  <el-button slot="reference" type="text">
                    <span v-if="formData.businessType === 20">{{ $t('good.stagedetail') }}</span>
                    <span v-if="formData.businessType === 0">{{ $t('good.rentdetail') }}</span>
                  </el-button>
                  <el-table :data="scope.row.skuStageVOList" border>
                    <el-table-column :label="formData.businessType === 20 ? $t('good.stagenum'): $t('good.stage')" prop="stageNumber">
                      <template slot-scope="scope">
                        <span>{{ scope.row.stageNumber + scope.row.unit }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="formData.businessType === 20 ? $t('good.onestageprice'): $t('good.stageprice')" prop="stagePrice">
                      <template slot-scope="scope">
                        <span>{{ scope.row.stagePrice + '$' }}/{{ scope.row.unit }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formData.businessType === 0" :label="$t('good.onepayprice')" prop="onePayPrice">
                      <template slot-scope="scope">
                        {{ scope.row.onePayPrice + '$' }}
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formData.businessType === 0" :label="$t('good.renewalstagePrice')" prop="renewalStagePrice">
                      <template slot-scope="scope">
                        <span>{{ scope.row.renewalStagePrice + '$' }}/{{ scope.row.unit }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formData.businessType === 0" :label="$t('good.renewalonePrice')" prop="renewalOnePrice">
                      <template slot-scope="scope">
                        <span>{{ scope.row.renewalOnePrice + '$' }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card">
          <div slot="header">
            <span class="header">{{ $t('common.actionsLog') }}</span>
          </div>
          <el-table :data="logData" :max-height="600" border>
            <el-table-column :label="$t('good.actionTime')" prop="date"/>
            <el-table-column :label="$t('good.actionContent')" prop="operationDesc"/>
            <el-table-column :abel="$t('good.actionUser')" prop="userName"/>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList"/>
        </el-card>
      </div>
      <div slot="footer">
        <el-button type="info" @click="closeDialog()">{{ $t('common.close') }}</el-button>
      </div>
    </el-dialog>
    <!-- <el-button icon="el-icon-back" type="primary" @click="goBack()">返回</el-button> -->
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
import pagination from '@/components/Pagination/index.vue'
export default {
  components: {
    pagination
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      detailDialog: false,
      formData: {},
      logData: [],
      tableData: [
        {
          skuId: '123132'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  computed: {
    isStaging() {
      if (this.formData.channelCode.length !== 1 || !this.formData.channelCode.includes('STAGING')) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    dialog: {
      handler(value) {
        console.log('dialog', value);
        this.detailDialog = value;
        if (value) {
          console.log('商品编号', this.obj.no);
          this.getLog(this.obj.no);
        }
      }
    },
    obj: {
      handler(value) {
        this.formData = value;
        console.log('this.formData', this.formData);
      },
      deep: true
    }
  },
  created() {

  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 分页跳转
    getList() {
      this.getLog(this.obj.no);
    },
    getLog(no) {
      const data = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        spuNo: no
      }
      goodsApi.goodsOperate(data).then(res => {
        if (res.code === 200) {
          this.logData = res.data.list;
          this.total = res.data.totalCount;
        } else {
          this.$message.info(res.msg);
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .detail-container {
    padding: 20px;
    .goods-info {
      background-color: #fff;
    }
    .table {
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;
      text-align: center;
      tr td:nth-of-type(1){
        width: 12%;
        background: #FAFAFA;
      }
      tr td:nth-of-type(3){
        width: 12%;
        background: #FAFAFA;
      }
      tr td:nth-of-type(5){
        width: 12%;
        background: #FAFAFA;
      }
      td {
        border: 1px solid #ebeef5;
        padding: 0 6px;
        height:36px;
        font-size: 12px;
        color: #606266;
        box-sizing: border-box;
      }
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .box-card {
      margin-bottom: 16px;
      .header {
        display: flex;
        width: 100%;
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
      }
    }
  }
</style>
