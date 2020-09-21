<template>
  <div class="order-opreation">
    <el-card class="box-card">
      <div slot="header" class="title-info">
        <span>订单操作记录</span>
      </div>
      <div class="info-content">
        <el-radio-group v-model="radio3" class="order-radio" @change="change">
          <el-radio-button v-for="(item, index) in orderInfo.orderDetailVos" :key="index" :label="item.oid">{{ item.productInfo.name }} 【{{ item.productInfo.detail }}】</el-radio-button>
        </el-radio-group>
        <el-table :data="opreatData" :max-height="600" border>
          <el-table-column label="时间" prop="operateTime"/>
          <el-table-column label="内容" prop="content"/>
          <el-table-column label="操作" prop="username"/>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
export default {
  components: {},
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      opreatData: [],
      orderInfo: {},
      radio3: ''
    }
  },
  watch: {
    order: {
      handler(value) {
        console.log('监听的订单号', value);
        this.orderInfo = value;
        this.radio3 = this.orderInfo.orderDetailVos[0].oid;
        this.getInfo(value.orderDetailVos[0].oid);
      },
      deep: true
    }
  },
  // created() {
  //   this.getInfo(this.orderNo)
  // },
  methods: {
    change(value) {
      this.getInfo(value);
    },
    getInfo(value) {
      console.log('订单操作记录', value);
      orderApi.opreatLog({ orderNo: value }).then(res => {
        if (res.code === 200) {
          this.opreatData = res.data;
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .order-opreation {
    .box-card {
      margin-bottom: 16px;
      .title-info {
        padding: 10px 10px 10px 15px;
        border-left: 2px solid #2592FC;
        background-color: #f3f3f3;
      }
      .order-status {
        margin-left: 40px;
        color: orange;
      }
    }
    .order-radio {
      margin-bottom: 15px;
    }
  }
</style>
