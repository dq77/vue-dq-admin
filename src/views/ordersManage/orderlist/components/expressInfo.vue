<template>
  <div v-if="dialog" class="express-info-container">
    <el-dialog
      :visible.sync="dialog"
      title="物流信息"
      center
      width="650px"
      @close="closeExpress">
      <el-form :model="expressObj" label-width="120px">
        <el-form-item label="商品：" placeholder="选择订单">
          <el-select v-if="orderData.orderDetailVos" v-model="orderObj" value-key="oid" class="input-300" @change="selectOrder">
            <el-option v-for="item in orderData.orderDetailVos" :key="item.oid" :value="item" :label="item.productInfo.name"/>
          </el-select>
          <span>{{ orderObj.skuContent }}</span>
        </el-form-item>
        <el-form-item label="分类：">
          <el-radio-group v-model="expressObj.expressType" @change="selectType">
            <el-radio-button v-if="orderData.orderDetailVos" :disabled="!orderData.orderDetailVos" label="SEND">发货物流</el-radio-button>
            <el-radio-button v-if="orderData.orderDetailVos && ( orderData.tradeType === 'Lease' || orderData.tradeType === 'Renewal') && orderData.status > 10059 && orderData.status < 10065 && !orderData.renewalFlag" label="EXPIRE_BACK">到期归还物流</el-radio-button>
            <el-radio-button v-if="!orderData.orderDetailVos" :disabled="!orderData.orderDetailVos" label="REFUND_BACK">退货物流</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流：">
          <span v-if="expressData.expCompany">
            <span v-show="!isEdit">{{ expressData.expCompany }}——</span>
            <span v-show="!isEdit">{{ expressData.expCode }}</span>
            <el-button v-show="!isEdit" type="text" @click="isEdit = true">修改</el-button>
          </span>
          <span v-show="isEdit">
            <el-select v-model="expressObj.expCompany" placeholder="请选择物流公司">
              <el-option v-for="item in companyList" :key="item.expressId" :value="item.expressCode" :label="item.expressName"/>
            </el-select>
            <el-input v-if="youself" v-model="expressObj.expCode" class="input-200" placeholder="请填写物流单号"/>
            <el-button type="text" class="btn-comfirm" @click="logistics()">确认</el-button>
            <el-button v-show="isEdit" type="text" @click="cancelEdit()">取消</el-button>
          </span>
          <span v-if="!expressData.expCode && !expressData.expCompany">
            <span v-show="!isEdit">
              <span>未维护</span>
              <el-button type="text" @click="createExp()">维护发货物流</el-button>
            </span>
          </span>
        </el-form-item>
        <el-form-item v-if="expressData.expCompany" label="确认收货状态：">
          <span v-if="orderObj.status === 10042 && !expressData.signTime">未确认</span>
          <el-button v-if="orderObj.status === 10042 && !expressData.signTime " type="text" @click="recevied()">确认收货</el-button>
          <span v-if="expressData.signTime">已确认</span>
        </el-form-item>
        <el-form-item v-if="expressData.expCompany" label="确认收货时间：">
          <span>{{ expressData.signTime }}</span>
        </el-form-item>
        <el-form-item v-if="expressData.expCompany" label="确认方式：">
          <span>{{ expressData.signType }}</span><span v-if="expressData.signName">({{ expressData.signName }})</span>
        </el-form-item>
      </el-form>
      <logistics :info="expressData.expInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
import logistics from './logistic'
// import { deepClone } from '@/utils/index.js'
export default {
  components: {
    logistics
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      expressObj: {
        expressType: 'SEND'
        // deliveryType: 1
      },
      orderData: {},
      orderObj: {},
      isEdit: false,
      isCreate: false,
      expressData: {},
      companyList: []
    }
  },
  computed: {
    youself: function() {
      return (this.expressObj.expCompany !== 'PS' && this.expressObj.expCompany !== 'ZT');
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.orderData = this.dataSource;
          if (this.orderData.orderDetailVos) {
            // 当子订单orderDetailVos存在时，则是订单页查询物流，类型默认是SEND。
            this.orderObj = this.$store.getters.orderObj.orderDetailVos[0];
            this.expressObj.expressType = 'SEND';
          } else {
            // 如果是退单页查询物流，则默认是类型时REFUND_BACK。
            this.orderObj = this.$store.getters.orderObj;
            this.expressObj.expressType = 'REFUND_BACK';
          }
          this.getExpressCompany();
          this.getExpress({ orderNo: this.orderObj.oid, expressType: this.expressObj.expressType });
        }
      }
    }
  },
  created() {},
  methods: {
    // 选择订单
    selectOrder(value) {
      console.log('选择订单', value);
      this.getExpress({ orderNo: value.oid, expressType: this.expressObj.expressType });
    },
    // 选择物流类型
    selectType(value) {
      this.getExpress({ orderNo: this.orderObj.oid, expressType: value });
    },
    // 获取物流公司
    getExpressCompany() {
      orderApi.expressCompany().then(res => {
        if (res.code === 200 && res.data) {
          this.companyList = res.data;
        }
      })
    },
    // 获取物流详情
    getExpress(obj) {
      orderApi.expressDetail(obj).then(res => {
        this.expressData = res.data || {};
        this.$set(this.expressObj, 'expCode', this.expressData.expCode);
        this.$set(this.expressObj, 'expCompany', this.expressData.apiCode);
        this.$set(this.expressObj, 'expressType', this.expressData.expressType || this.expressObj.expressType)
        this.isEdit = false; // 每查询一次就将编辑框隐藏
      })
    },
    // 创建物流单号
    createExp() {
      this.isEdit = true;
      this.isCreate = true;
    },
    // 取消修改单号
    cancelEdit() {
      this.$set(this.expressObj, 'expCode', this.expressData.expCode);
      this.$set(this.expressObj, 'expCompany', this.expressData.apiCode);
      this.isEdit = false;
    },
    // 维护物流信息
    logistics() {
      this.expressObj.expCode = (this.expressObj.expCompany === 'PS' || this.expressObj.expCompany === 'ZT') ? '' : this.expressObj.expCode;
      console.error('维护物流', this.expressObj);
      if (!this.isCreate) {
        this.expressObj.orderNo = this.orderObj.oid;
        orderApi.updateExpress(this.expressObj).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功！');
            this.getExpress({ orderNo: this.orderObj.oid, expressType: this.expressObj.expressType });
            this.isEdit = false;
            this.$emit('refresh');
          } else {
            this.$message.error(res.msg);
          }
        })
      } else if (this.isCreate) {
        this.expressObj.oid = this.orderObj.oid
        orderApi.createExpress(this.expressObj).then(res => {
          console.log('维护物流res', res);
          if (res.code === 200) {
            console.log('修改物流');
            this.$message.success('创建成功！');
            this.getExpress({ orderNo: this.orderObj.oid, expressType: this.expressObj.expressType });
            this.isEdit = false;
            this.isCreate = false;
            this.$emit('refresh');
          } else {
            this.$message.error(res.msg);
          }
        })
      }
    },
    // 确认收货按钮
    recevied() {
      orderApi.receviedGood({ expCode: this.expressData.expCode }).then(res => {
        if (res.code === 200) {
          this.$message.success('确认收货成功！');
          this.getExpress({ orderNo: this.orderObj.oid, expressType: this.expressObj.expressType })
          this.$emit('refresh');
        } else {
          this.$message.info(res.msg);
        }
      })
      console.log('确认收货');
    },
    // 关闭物流弹窗
    closeExpress() {
      this.orderObj = {};
      this.logisticsDialog = false;
      this.$emit('handClose');
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.express-info-container {
  .send-type {
    margin-bottom: 20px;
  }
  .input-200, .btn-comfirm {
    margin-left: 10px;
  }
}
</style>
