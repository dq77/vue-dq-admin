<template>
  <div class="sku-base">
    <table class="table">
      <tr>
        <td class="table-td-bgcolor">商品名称</td>
        <td>{{ baseInfo.spuName }}</td>
        <td class="table-td-bgcolor">商品类型</td>
        <td>{{ baseInfo.type | goodsType }}</td>
        <td class="table-td-bgcolor">商品描述</td>
        <td>{{ baseInfo.brief }}</td>
      </tr>
      <tr>
        <td class="table-td-bgcolor">类目</td>
        <td>{{ categoryName }}</td>
        <td class="table-td-bgcolor">类目下排序</td>
        <td>{{ baseInfo.categorySort }}</td>
        <td class="table-td-bgcolor">渠道</td>
        <td>{{ baseInfo.channelList.join('、') }}</td>
      </tr>
      <tr>
        <td class="table-td-bgcolor">标签</td>
        <td>{{ baseInfo.labelList.join('、') }}</td>
        <td class="table-td-bgcolor">标签下排序</td>
        <td>{{ baseInfo.channelCategorySort }}</td>
        <td class="table-td-bgcolor">是否安装</td>
        <td>
          <span v-if="baseInfo.isInstallation === 1">是{{ baseInfo.installationCost }}</span>
          <span v-if="baseInfo.isInstallation === 0">否</span>
        </td>
      </tr>
      <tr>
        <td class="table-td-bgcolor">商品视频</td>
        <td :colspan="5">
          <video :src="baseInfo.spuBasePictureUrl + baseInfo.video" width="200px" height="100px"/>
        </td>
      </tr>
      <tr>
        <td class="table-td-bgcolor">商品详情</td>
        <td :colspan="2">
          <span v-for="(item,index) in baseInfo.detail" :key="index">
            <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
          </span>
        </td>
        <td class="table-td-bgcolor">商品参数</td>
        <td :colspan="2">
          <span v-for="(item,index) in baseInfo.parameter" :key="index">
            <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
          </span>
        </td>
      </tr>
      <tr>
        <td class="table-td-bgcolor">商品图片</td>
        <td :colspan="2">
          <span v-for="(item,index) in baseInfo.pictureRollList" :key="index">
            <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
          </span>
        </td>
        <td class="table-td-bgcolor">商品售后</td>
        <td :colspan="2">
          <span v-for="(item,index) in baseInfo.afterSale" :key="index">
            <img :src="baseInfo.spuBasePictureUrl + item" width="40px">
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      baseInfo: {}
    }
  },
  created() {
    console.log('skuInfo', this.$store.getters.goodsInfo);
    this.baseInfo = this.$store.getters.goodsInfo;
    this.getCategoryName();
  },
  methods: {
    getCategoryName() {
      var list = this.$store.getters.category;
      list.map(item => {
        if (item.id === this.baseInfo.categoryId) {
          this.categoryName = item.name;
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .sku-base {
    .table{
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;
      tr td:nth-of-type(1){
        width: 12%;
      }
      tr td:nth-of-type(3){
        width: 12%;
      }
      tr td:nth-of-type(5){
        width: 12%;
      }
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
    .table-td-bgcolor{
      background: #FAFAFA;
    }
  }
</style>
