<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="stock-detail-container">
    <el-dialog :visible.sync="dialog" :title="$t('warehouse.stockdetail')" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" label-width="100px" status-icon>
        <el-form-item :label="$t('warehouse.stockcode')" prop="code">
          <span>{{ formData.code }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockname')" prop="name">
          <span>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockaddress')" prop="area">
          <span
            v-if="formData.address"
          >{{ formData.address.indexAndDetail[1] }} {{ formData.address.indexAndDetail[2] }} {{ formData.address.indexAndDetail[3] }} {{ formData.address.districts[1].name }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehouse.stockmanager')" prop="managers">
          <span v-for="item in formData.managers" :key="item.id">{{ ` ${item.name}` }}</span>
        </el-form-item>
        <el-form-item :label="$t('common.remark')">
          <span>{{ formData.remark }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehouse.usestatus')" prop="status">
          <span v-if="formData.enabled">{{ $t('warehouse.inuse') }}</span>
          <span v-else>{{ $t('warehouse.outuse') }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '../../../../utils';
export default {
  components: {},
  props: {
    dataSource: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      formData: {
        rentRatio: '',
        saleRatio: '',
        partnerName: '',
        province: '',
        contactName: '',
        status: 1,
        commissionRatio: '',
        remark: ''
      }
    };
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val;
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource.id) {
          Object.assign(this.formData, deepClone(this.dataSource));
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].resetFields();
      this.$refs['formData'].clearValidate();
      this.formData = {
        rentRatio: null,
        saleRatio: null,
        partnerName: '',
        province: '',
        contactName: '',
        contactPhone: '',
        plan: 1,
        commissionRatio: null,
        remark: ''
      };
      this.$emit('handClose', false);
    }
  }
};
</script>

<style rel='stylesheet/scss' lang="scss">
.stock-detail-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .plan-title {
    font-size: 18px;
    color: #333333;
  }
}
</style>
