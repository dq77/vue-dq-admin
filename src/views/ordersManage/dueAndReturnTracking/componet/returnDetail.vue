<template>
  <div class="return-express">
    <el-dialog :visible.sync="dialog" title="归还详情" center @close="closeDialog">
      <el-form label-width="150px">
        <el-form-item v-if='!isEdit' label="归还方式：">
          <span>{{ expressData.expCompany }} </span> 
          <el-button v-if='formData.returnStatus != 10064' type="text" @click="editExpress()"> 修改</el-button>
        </el-form-item>
        <el-form-item v-if="expressData.apiCode !== 'PS' && expressData.apiCode !== 'ZT' && expressData.expCode && !isEdit" label="物流单号：">
          <span>{{ expressData.expCode }}</span>
        </el-form-item>
        <el-form-item v-if='!isEdit' label="归还时间：">
          <span>{{ expressData.deliveryTime }}</span>
        </el-form-item>

        <el-form-item v-if='isEdit' label="归还方式：">
          <el-select v-model="expObj.expCompany">
            <el-option v-for="item in companyList" :key="item.expressCode" :value="item.expressCode" :label="item.expressName"/>
          </el-select> 
        </el-form-item>
        <el-form-item v-if='isEdit && expObj.expCompany !== "PS" && expObj.expCompany !== "ZT" ' label="物流单号：">
          <el-input v-model="expObj.expCode" class='input-220' placeholder="请填写物流单号"/>
        </el-form-item>
        <el-form-item v-if='isEdit' label="归还时间：">
          <el-date-picker
            v-model="expObj.backTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if='isEdit' label=" ">
          <el-button @click="comfirm" type='text'>确认</el-button>
          <el-button @click="cancel" type='text'>取消</el-button>
        </el-form-item>
        <logistic :info="logisticData"/>
        <div class="expand-express">
          <el-button type="text" size="small" @click="expandExpress">
            <span v-if="!expand">查看更多物流详情</span>
            <span v-if="expand">收起物流详情</span>
          </el-button>
        </div>
        <el-form-item label="回仓时间：">
          <span>{{ expressData.signTime }}</span>
        </el-form-item>
        <el-form-item label="是否需要赔偿：">
          <span v-if="expressData.payType">是</span>
          <span v-if="!expressData.payType">否</span>
        </el-form-item>
        <el-form-item :label="titleFilter(formData.payChannel)">
          <span v-if="formData.restDeposit !== ''">{{ formData.restDeposit }}$</span>
        </el-form-item>
        <el-form-item label="扣款金额：">
          <span v-if="expressData.paidPoundage !== ''">{{ expressData.paidPoundage }}$</span>
          <!-- <el-button type="primary" @click="payInfo()" class="pay-info">查看扣款解冻日志</el-button> -->
        </el-form-item>
        <el-form-item label="线下补差：">
          <span v-if="expressData.payType === 'OFFLINE'">是</span>
          <span v-if="!expressData.payType">无</span>
        </el-form-item>
        <el-form-item label="到期归还备注：">
          <span v-if="formData.sellerRemark">{{ formData.sellerRemark[0].content }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <pay-info :show="payInfoDialog" @handClose="closePayInfo"/>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
import logistic from '../../orderlist/components/logistic'
import payInfo from './payInfo'
export default {
  components: {
    logistic,
    'pay-info': payInfo
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
      formData: {},
      expObj: {
        expressType: 'EXPIRE_BACK',
        expCompany: '',
        expCode: '',
        backTime: '',
        oid: ''
      }, // 修改的物流信息
      expand: false, // 展开物流详情标志 true 是  false 否
      logisticData: [], // 物流详情
      payInfoDialog: false, // 日志弹窗
      companyList: [],
      company: '',
      expCode: '',
      dialog: false,
      radio: '',
      expressData: {},
      isEdit: false,
      // isCreate: false
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.formData = { ...this.dataSource };
          console.log(this.formData);
          this.getExpressInfo(this.dataSource.orderDetailVos ? this.dataSource.orderDetailVos[0].oid : '');
          this.getCompany();
        }
      }
    }
  },
  created() {
    this.getCompany();
  },
  methods: {
    // 修改物流
    editExpress() {
      this.isEdit = true;
      this.expObj = {
        oid: this.dataSource.orderDetailVos ? this.dataSource.orderDetailVos[0].oid : '',
        expCode: this.expressData.expCode,
        backTime: new Date(this.expressData.deliveryTime),
        expCompany: this.expressData.apiCode,
        expressType: 'EXPIRE_BACK'
      }
    },
    titleFilter(type) {
      switch (type) {
        case 'ALIPAY_AUTH':
          return '剩余预授冻结金额';
        case 'HUA_BEI':
          return '剩余预授冻结金额';
        case 'JD_H5':
          return '剩余冻结押金';
        case 'JD_PERIODIC':
          return '剩余冻结押金';
      }
    },

    // 获取物流详情
    getExpressInfo(no) {
      const data = {
        orderNo: no,
        expressType: 'EXPIRE_BACK'
      }
      orderApi.expressDetail(data).then(res => {
        if (res.code === 200) {
          this.expressData = res.data || {};
          this.expressHalf();
        } else {
          this.expressData = {};
          this.$message.info(res.msg)
        }
      })
    },

    // 点击展开物流详情
    expandExpress() {
      this.expand = !this.expand;
      this.expressHalf();
    },
    // 获取前半部分展示
    expressHalf() {
      if (this.expressData.expInfo && this.expressData.expInfo.length > 3) {
        if (!this.expand) {
          this.logisticData = this.expressData.expInfo.slice(0, 3);
        } else {
          this.logisticData = this.expressData.expInfo;
        }
      } else {
        this.logisticData = this.expressData.expInfo || [];
      }
    },

    // 查看解冻日志
    payInfo() {
      this.payInfoDialog = true;
    },

    // 关闭解冻日志弹窗
    closePayInfo(val) {
      this.payInfoDialog = false;
    },
    // 获取物流公司
    getCompany() {
      orderApi.expressCompany().then(res => {
        if (res.code === 200) {
          this.companyList = res.data;
        }
      })
    },
    // 获取物流详情
    getExpress(no) {
      const data = {
        expressType: 'EXPIRE_BACK',
        orderNo: no
      }
      orderApi.expressDetail(data).then(res => {
        if (res.code === 200) {
          this.expressData = res.data;
        } else {
          this.$message.info(res.msg);
          this.expressData = {};
        }
      })
    },
    // 创建物流
    // createExpress(data) {
    //   orderApi.createExpress(data).then(res => {
    //     if (res.code === 200) {
    //       this.$message.success('创建成功！');
    //       this.isEdit = false;
    //       this.isCreate = false;
    //       this.getExpress(data.oid);
    //     }
    //   })
    // },
    // 编辑物流单号
    updateExpress(data) {
      orderApi.updateExpress(data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功！');
          this.isEdit = false;
          this.getExpressInfo(data.oid);
        } else {
          this.$message.info(res.msg);
        }
      })
    },
    // 切换子订单详情
    selectOid(val) {
      this.getExpress(val);
    },
    // 创建物流
    // create() {
    //   this.isEdit = true;
    //   this.isCreate = true;
    //   this.company = '';
    //   this.expCode = '';
    //   console.log('创建物流');
    // },
    // 编辑确认提交物流单号
    comfirm() {
      let nexg = /^[A-Za-z0-9]+$/
      if ((this.expObj.expCompany !== 'PS' && this.expObj.expCompany !== 'ZT') && !this.expObj.expCode) {
        this.$message.info('单号不能为空');
        return
      } else if ((this.expObj.expCompany !== 'PS' && this.expObj.expCompany !== 'ZT') && !nexg.test(this.expObj.expCode)) {
        this.$message.info('单号只能是数字或字母!')
        return
      }
      if ( this.expObj.expCompany == 'PS' || this.expObj.expCompany == 'ZT' ) {
        this.expObj.expCode = ''
      }
      this.updateExpress(this.expObj)
    },
    // 取消修改物流
    cancel() {
      this.isEdit = false;
      this.expObj = {
        expressType: 'EXPIRE_BACK',
        expCompany: '',
        expCode: '',
        oid: ''
      };
    },
    // 创建物流
    // createSubmit() {
    //   const data = {
    //     expCode: this.expCode,
    //     expCompany: this.company,
    //     expressType: 'EXPIRE_BACK',
    //     oid: this.radio
    //   }
    //   this.createExpress(data);
    // },
    // 关闭弹窗
    closeDialog() {
      this.dialog = false;
      this.$emit('handClose');
      this.formData = {};
      this.expressData = {};
      this.logisticData = [];
      this.expObj = {};
      this.isEdit = false;
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.marginLeft{
  margin-left: 10px;
}
.el-radio {
  margin-left: 0;
  margin-bottom: 8px;
}
.pay-info {
  margin-left: 20px;
}
.expand-express {
  padding: 10px 0 20px;
  text-align: center;
}
</style>
