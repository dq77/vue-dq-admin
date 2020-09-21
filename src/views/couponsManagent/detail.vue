<template>
  <div class="coupons-detail">
    <el-dialog :visible.sync="dialog" title="优惠券详情" center width="600px" @close="closeDialog">
      <el-form label-width="120px">
        <el-form-item label="渠道：">
          <span v-for="(item, index) in formData.channel" :key="index">
            <el-tag>{{ item | channelFilter }}</el-tag>
          </span>
        </el-form-item>
        <el-form-item label="名称：">
          <span>{{ formData.couponName }}</span>
        </el-form-item>
        <el-form-item label="类型：">
          <span v-if="formData.couponType === 31">满减</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-radio-group v-model="formData.payType">
            <el-radio :label="3" disabled>全部</el-radio>
            <el-radio :label="1" disabled>一次性支付</el-radio>
            <el-radio :label="2" disabled>分期支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠方式：">
          <el-radio-group v-model="formData.discountType">
            <el-radio :label="1" disabled>首期优惠</el-radio>
            <el-radio :label="2" disabled>均摊优惠</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值：">
          <span v-if="formData.couponMoney">{{ formData.couponMoney }}$</span>
        </el-form-item>
        <el-form-item label="门槛：">
          <span v-if="formData.spendMoney">{{ formData.spendMoney }}$</span>
        </el-form-item>
        <el-form-item label="发行量：">
          <span>
            <span v-if="formData.releaseType === 1">总发放量</span>
            <span v-if="formData.releaseType === 2">每日发放量</span>
            {{ formData.couponNum }}张</span>
        </el-form-item>
        <el-form-item label="发放时间：">
          <div>开始时间：{{ formData.releaseStartTime }}</div>
          <div>结束时间：{{ formData.releaseEndTime }}</div>
        </el-form-item>
        <el-form-item label="使用说明：">
          <span>{{ formData.couponDes }}</span>
        </el-form-item>
        <el-form-item label="有效期限：">
          <div v-if="formData.validEndTime && formData.validStartTime">
            <div>开始时间：{{ formData.validStartTime }}</div>
            <div>结束时间：{{ formData.validEndTime }}</div>
          </div>
          <div v-if="formData.couponTime">领取{{ formData.couponTime }}{{ formData.couponTimeUnit | timeFilter }}后过期</div>
        </el-form-item>
        <el-form-item label="可用范围：">
          <span v-if="formData.goodsType === 10">全场商品</span>
          <span v-if="formData.goodsType === 11">
            <el-tag v-for="(item,index) in formData.goodsList" :key="index">
              {{ getName(item) }}
            </el-tag>
          </span>
        </el-form-item>
        <el-form-item label="发放用户：">
          <span v-if="formData.userType === 20">所有用户</span>
          <span v-if="formData.userType === 21">新用户</span>
          <span v-if="formData.userType === 22">老用户</span>
        </el-form-item>
        <el-form-item label="领取方式：">
          <span v-if="formData.scene === 'GOODS'">商品详情页领取</span>
          <span v-if="formData.scene === 'ACTIVITY'">活动页专属</span>
          <span v-if="formData.scene === 'EXCHAGE'">兑换码兑换</span>
        </el-form-item>
        <el-form-item label="活动截止时间：">
          <span>{{ formData.deadline }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" plain @click="closeDialog">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goods.js'
export default {
  components: {},
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
      formData: {},
      allGoods: []
    }
  },
  watch: {
    show: {
      handler(val) {
        console.log('优惠券详情', val);
        this.dialog = val;
        if (val) {
          this.formData = this.dataSource;
          this.getAllGoods(this.formData.channel);
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog');
    },
    getName(val) {
      console.log('商品过滤', this.allGoods);
      for (let i = 0; i < this.allGoods.length; i++) {
        if (this.allGoods[i].no === val) {
          return this.allGoods[i].name;
        }
      }
    },
    // 获取所有的商品
    getAllGoods(channel) {
      const data = {
        channels: channel
      }
      goodsApi.CouponGoodsList(data).then(res => {
        if (res.code === 200) {
          this.allGoods = res.data;
        } else {
          this.$message.success(res.msg);
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
