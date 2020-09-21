<template>
  <div class="coupons-out">
    <el-dialog :visible.sync="dialog" title="兑换码导出" center width="600px" @close="closeDialog">
      <el-table
        :data="codeInfo"
        border
        stripe
        style="width: 100%"
        max-height="600">
        <el-table-column
          prop="totalAmount"
          label="总发行量"
          align="center"/>
        <el-table-column
          prop="exportedAmount"
          label="已导出数量"
          align="center"/>
        <el-table-column
          prop="releasedAmount"
          label="支付宝发放量"
          align="center"/>
        <el-table-column
          prop="boundAmount"
          label="实际领取量"
          align="center"
          width="100"/>
        <el-table-column
          prop="usageRate"
          label="使用率"
          align="center"/>
      </el-table>
      <br/>
      <el-form ref="formData" :model="formData" label-width="100px">
        <el-form-item label="导出数量" prop="outNum">
          <el-input v-model="formData.outNum" placeholder="请输入导出数量" clearable class="input-200 outbtn"/>
          <el-button :disabled="dataSource.couponStatus === 2 || dataSource.couponStatus === 3" :loading="outBtn" type="primary" icon="el-icon-download" @click="outCode()">{{ outBtn?'导出中....':'确认导出' }}</el-button>
        </el-form-item>
      </el-form>
      <p>导出记录</p>
      <el-table
        :data="couponHistory"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="actionTime"
          label="导出时间"
          align="center">
          <template slot-scope="scope">
            {{ scope.row.actionTime.split('T')[0] +' '+ scope.row.actionTime.split('T')[1] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="导出数量"
          align="center"/>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
          width="100"/>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="scope">
            <a :href="scope.row.downloadPath" class="down-history" download="w3logo">下载兑换码</a>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="info" plain @click="closeDialog">关闭</el-button>
      </div>
      <iframe :src="downUrl" name="codeTargetIfr" style="display: none"/>
    </el-dialog>
  </div>
</template>

<script>
import couponApi from '@/api/coupon.js'
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
      downUrl: '',
      dialog: false,
      outBtn: false,
      codeInfo: [],
      formData: {},
      couponHistory: []
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.getHistory(this.dataSource);
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$refs['formData'].resetFields()
      this.formData.outNum = ''
      this.$emit('closeDialog');
    },
    // 获取所有的历史
    getHistory(coupon) {
      const data = {
        couponId: coupon.id
      }
      couponApi.getExportHistory(data).then(res => {
        if (res.code === 200) {
          this.couponHistory = res.data.exportRecords;
          this.codeInfo = [res.data]
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 导出按钮
    outCode() {
      const value = this.formData.outNum
      let maxVal = this.codeInfo[0].totalAmount * 1 - this.codeInfo[0].exportedAmount * 1
      if (maxVal > 200000) { maxVal = 200000 }
      if (!value) {
        this.$message.error('导出数量不能为空');
        return false
      } else if (isNaN(value)) {
        this.$message.error('导出数量只能是数字');
        return false
      } else if (value * 1 !== (value * 1).toFixed()) {
        this.$message.error('你只能输入整数');
        return false
      } else if (value * 1 > maxVal) {
        this.$message.error(`你最多只能导出${maxVal}张`);
        return false
      }
      const data = {
        couponId: this.dataSource.id,
        quantity: (value * 1).toFixed()
      }
      this.outBtn = true
      couponApi.exportCoupon(data).then(res => {
        this.outBtn = false
        if (res.code === 200) {
          this.$message.success('导出成功');
          this.downUrl = res.data
          this.$refs['formData'].resetFields();
          this.getHistory(this.dataSource);
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.coupons-out{
  .outbtn{
    margin-right: 10px;
  }
  .down-history{
    color: #409eff;
  }
}
</style>
