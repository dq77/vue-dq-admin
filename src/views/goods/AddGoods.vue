<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 14:30:08
 * @LastEditTime: 2019-08-12 14:36:33
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="add-goods-container">
    <el-button icon="el-icon-back" type="primary" @click="goBack()">{{ $t('common.back') }}</el-button>
    <div class="add-goods">
      <el-steps :active="active" align-center>
        <el-step :title="$t('good.baseInfo')"/>
        <el-step :title="$t('good.skuinfo')"/>
      </el-steps>
      <base-info v-if="active ===1" @nextStep="nextStep"/>
      <!-- <base-info v-if="active ===1" :baseObj="baseInfo" @nextStep="nextStep"/> -->
      <!-- <add-sku v-if="active === 2"/> -->
      <sku-info v-if="active === 2" @frontStep="frontStep"/>
    </div>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo.vue'
import skuInfo from './components/addsku.vue'
// import AddSku from './components/addsku'
import goodsApi from '@/api/goods.js'
export default {
  components: {
    'base-info': baseInfo,
    'sku-info': skuInfo
    // 'add-sku': AddSku
  },
  data() {
    return {
      active: -1,
      baseInfo: {
        afterSaleType: 1, // 售后默认模板
        isRenewal: 1, // 是否可续租
        name: '',
        brandId: '',
        type: 0,
        label: [],
        pictureRoll: [],
        detail: [],
        parameter: [],
        afterSale: [],
        channelCode: [],
        supplierMode: 'SUPPLY',
        freightServiceProvider: '',
        merchantId: '',
        merchantName: '',
        chargeRate: '',
        isTest: 0,
        isFace: 0,
        isAuthentication: 0,
        isInstallation: 0,
        installationCost: '',
        businessType: 0,
        goodsLabel: [],
        categoryId: '',
        categorySort: '',
        channelCategoryId: '',
        specificationVOList: [],
        skuVOList: [
          {
            detail: '',
            erpCode: '',
            supplierSettlementPrice: '',
            taobaoSkuId: '',
            salePrice: '',
            officialPrice: '', // 官网售价
            depositPrice: '', // 押金
            picture: '', // sku图片
            stageRuleVOList: [], // 租期sku列表
            skuRelationShowVOList: []
          }
        ]
      },
      skuInfo: {}
    }
  },
  created() {
    if (this.$route.query.spuNo) {
      this.getDetail(this.$route.query.spuNo);
    } else if (!this.$route.query.spuNo) {
      this.$store.commit('SET_INFO', this.baseInfo);
      this.active = 1;
    }
  },
  methods: {
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    },
    // 获取商品详情
    getDetail(no) {
      goodsApi.editDetail(no).then(res => {
        if (res.code === 200) {
          console.log('请求的商品详情！', res);
          Object.assign(res.data, res.data.goodsStrategy);
          if (res.data.supplierMode === 'DELIVER') {
            res.data.supplierMode = 'SUPPLY'
          }
          this.$store.commit('SET_INFO', res.data);
          this.active = 1;
        }
      })
    },
    nextStep() {
      this.active += 1;
    },
    frontStep() {
      this.active -= 1;
      console.log('上一步', this.active);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.add-goods-container {
  margin: 20px;
  // padding: 20px;
  .add-goods {
    padding: 20px;
    background-color: #fff;
    margin-top: 15px;
    .footer-btn {
      text-align: center;
    }
  }
}
</style>
