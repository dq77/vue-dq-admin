<template>
  <div class="confirm-money-container">
    <el-dialog :visible.sync="dialog" title="退收款确认" center @close="handClose(false)">
      <el-form :model="form" label-width="120px">
        <el-form-item label="收款方式：">
          <span v-if="form.paidType === 'ONLINE'">线上</span>
          <span v-else-if="form.paidType === 'OFFLINE'">线下</span>
          <span v-else>暂未进行退收款</span>
        </el-form-item>
        <el-form-item v-if="form.poundageType === 'REFUND' && form.paidType === 'ONLINE'" label="退款金额：">
          <span>{{ form.paidPoundage }}</span>
        </el-form-item>
        <el-form-item v-if="form.poundageType === 'RECIEVE' && form.paidType === 'ONLINE'" label="收款金额：">
          <span>{{ form.paidPoundage }}</span>
        </el-form-item>
        <el-form-item label="退收款状态：">
          <span v-if="form.poundageStatus === 10120"><el-tag type="info">失败</el-tag></span>
          <span v-if="form.poundageStatus === 10119"><el-tag type="success">成功</el-tag></span>
        </el-form-item>
        <el-form-item v-if="form.paidType === 'OFFLINE'" label="补差金额：">
          <span>{{ form.paidPoundage }}</span>
        </el-form-item>
        <el-form-item v-if="form.paidType === 'ONLINE'" label="第三方流水号：">
          <span>{{ form.thirdNo }}</span>
        </el-form-item>
        <el-form-item v-if="form.paidType === 'OFFLINE'" label="备注：">
          <el-table :data="form.remark" border>
            <el-table-column prop="content" label="操作内容"/>
            <el-table-column prop="operateTime" label="操作时间"/>
            <el-table-column prop="username" label="操作人"/>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="handClose(false)">取消</el-button>
        <el-button v-if="form.poundageStatus === 10119" type="primary" @click="handClose(true)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog: false,
      form: {}
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (val) {
          this.form = this.dataSource;
        }
      }
    }
    // dataSource: {
    //   handler(val) {
    //     this.form = val;
    //   },
    //   deep: true
    // }
  },
  methods: {
    handClose(val) {
      if (val) {
        this.$emit('handOk');
      } else if (!val) {
        this.$emit('handFalse');
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>

</style>
