<template>
  <div class="orderDetail-container">
    <div class="order-btn">
      <el-button icon="el-icon-back" type="primary" class="go-back" @click="goBack()">返回</el-button>
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="addRemark()">添加备注</el-button>
        <el-button v-if="obj.status === 10041 || obj.status === 10042 || obj.status === 10031" icon="el-icon-location" type="primary" @click="changeAddress()">修改地址</el-button>
        <el-button v-if="obj.status > 10040 && obj.status !== 10100" icon="el-icon-d-caret" type="primary" @click="viewLogistics()">物流信息</el-button>
        <el-button v-if="obj.status === 10010" icon="el-icon-circle-close" type="primary" @click="closeOrder()">取消订单</el-button>
      </div>
    </div>
    <div class="orderDetail-content">
      <base-info :base-obj="obj"/>
      <goods-info :goods-obj="obj" @refresh="refresh"/>
      <order-opreation :order="obj"/>
    </div>
    <el-dialog
      :visible.sync="remarkDialog"
      title="新增备注"
      width="500px"
      center>
      <el-form :model="formRemark" label-width="100px">
        <el-form-item label="添加备注：">
          <el-input v-model="formRemark.remark" :rows="3" placeholder="请填写备注"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="cancelRemark()">取消</el-button>
        <el-button type="primary" @click="submitRemark()">确定</el-button>
      </span>
    </el-dialog>
    <address-update :dialog="addressDialog" :address-info="addressInfo" @close="closeDialog" @submitAddress="submitAddress"/>
    <express-info :show="logisticsDialog" :data-source="obj" @handClose="handClose" @refresh="expressRefresh"/>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo'
import goodsInfo from './components/goodsInfo'
import payInfo from './components/payInfo'
import orderOpreation from './components/orderOpreation'
import addressUpdate from './components/address.vue'
import logisticsComponent from '@/views/ordersManage/orderlist/components/logistic.vue'
import orderApi from '@/api/order/order.js'
import expressInfo from './components/expressInfo'
// import { deepClone } from '@/utils/index.js'
export default {
  components: {
    'base-info': baseInfo,
    'goods-info': goodsInfo,
    'pay-info': payInfo,
    'order-opreation': orderOpreation,
    'address-update': addressUpdate,
    'logistics-component': logisticsComponent,
    'express-info': expressInfo
  },
  data() {
    return {
      remarkDialog: false, // 添加备注
      renewalDialog: false, // 续租弹窗
      logisticsDialog: false, // 查看物流信息弹窗
      addressData: [],
      orderObj: {}, // 选择的订单对象
      expressObj: {
        expressType: 'SEND',
        orderNo: ''
      },
      companyList: [], // 物流公司下拉框
      expressData: {}, // 物流详情对象
      selectObj: {}, // 选择的订单信息
      obj: {}, // 订单详情
      addressDialog: false,
      isEdit: false, // 编辑物流单号
      isCreate: false, // 创建物流单号
      company: '',
      formRemark: {
        remark: ''
      },
      addressInfo: {} // 地址详情
    }
  },
  watch: {
    '$route'(to, from) {
      console.error('路由变化');
    }
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.getDetail(this.$route.query.orderNo);
    console.log('订单详情', this.obj, this.orderNo);
  },
  beforeRouteUpdate(to, from, next) {
    console.log('修改路由参数', to, from, next);
    next();
  },
  methods: {
    getDetail(id) {
      orderApi.orderDetail({ orderId: id }).then(res => {
        if (res.code === 200) {
          console.log('订单的详情', res);
          this.obj = res.data;
        }
      })
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 打开备注弹窗
    addRemark() {
      this.remarkDialog = true;
      this.$set(this.formRemark, 'orderNo', this.obj.orderNo);
    },
    // 提交备注
    submitRemark() {
      console.log('备注参数', this.formRemark);
      if (!this.formRemark.remark) {
        this.$message.error('空备注不能提交！');
        return
      }
      orderApi.addRemark({ ...this.formRemark }).then(res => {
        console.log('添加备注', res);
        if (res.code === 200) {
          this.$message.success('添加备注成功！');
          this.formRemark.remark = '';
          this.getDetail(this.$route.query.orderNo);
          this.remarkDialog = false;
        } else {
          this.$message.info(res.message)
        }
      })
    },
    // 关闭备注弹窗
    cancelRemark() {
      this.formRemark.remark = '';
      this.remarkDialog = false;
    },
    // 查看续租记录
    renewal() {
      this.renewalDialog = true;
    },
    // 取消订单
    closeOrder() {
      this.$confirm('确定要取消此订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderApi.cancelOrder({ orderNo: this.obj.orderNo }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '取消成功!'
            });
            this.getDetail(this.$route.query.orderNo);
          } else {
            this.$message.info(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消失败!'
        })
      });
    },
    // 查看物流信息接口
    viewLogistics() {
      this.logisticsDialog = true;
      this.$store.commit('SET_ORDER', this.obj);
      // this.orderObj = this.obj.orderDetailVos[0];
      // this.getExpressCompany();
      // this.getExpress({ orderNo: this.orderObj.oid, expressType: 'SEND' });
    },
    // 修改地址
    changeAddress() {
      // this.getAddress(this.obj.uid);
      console.log('打开地址弹窗', this.addressData);
      this.addressInfo = {
        orderNo: this.obj.orderNo,
        receiverName: this.obj.receiverName,
        receiverMobile: this.obj.receiverMobile,
        receiverProvince: this.obj.receiverProvince,
        receiverCity: this.obj.receiverCity,
        receiverDistrict: this.obj.receiverDistrict,
        receiverDetailAddress: this.obj.receiverDetailAddress,
        cityCode: this.obj.cityCode,
        provinceCode: this.obj.provinceCode
      }
      orderApi.getAddress(this.obj.uid).then(res => {
        if (res.code === 200) {
          this.$set(this.addressInfo, 'addressData', res.data);
        } else {
          this.$message.info(res.msg)
        }
      })
      console.log('详情页地址对象', this.addressInfo);
      this.addressDialog = true;
    },
    // 提交地址修改
    submitAddress(value) {
      console.log('修改的地址信息', value);
      orderApi.updateAddress({ ...value }).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功！');
          this.getDetail(this.$route.query.orderNo);
          this.addressDialog = false;
        } else {
          this.$message.info(res.msg)
        }
      })
    },
    // getAddress(id, obj) {
    //   orderApi.getAddress(this.obj.uid).then(res => {
    //     if (res.code === 200) {
    //       console.log('默认地址', res.data);
    //       this.addressData = res.data;
    //     } else {
    //       this.$message.info(res.msg);
    //     }
    //   })
    // },
    closeDialog() {
      this.addressDialog = false;
      console.log('addressDialog', this.addressDialog);
    },
    refresh(obj) {
      if (obj.origin === 1000) {
        this.$router.push({
          name: 'orderDetail',
          query: {
            orderNo: obj.no
          }
        })
      } else if (obj.origin === 1111) {
        this.getDetail(this.$route.query.orderNo);
      }
    },
    buyOfRenewal(no) {
      orderApi.buyOfRenewal({ orderNo: no }).then(res => {
        if (res.code === 200) {
          this.obj = res.data;
        }
      })
    },
    handClose(val) {
      this.logisticsDialog = false;
    },
    expressRefresh() {
      this.getDetail(this.$route.query.orderNo);
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
  .orderDetail-container {
    padding: 15px;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    .orderDetail-content {
      flex: 1;
      overflow: auto;
    }
    .addRemark {
      text-align: right;
    }
    .order-btn {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
</style>
<style lang="scss">
  .distpicker-address-wrapper {
    select {
      height: 28px;
    }
  }
</style>
