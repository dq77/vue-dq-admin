<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="edit-stockNum-container">
    <el-dialog :visible.sync="dialog" :title="title" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="130px" status-icon>
        <el-form-item :label="$t('good.goodname')" prop="partnerName">
          <span>{{ formData.goodsName }}</span>
        </el-form-item>
        <el-form-item :label="$t('warehouse.allowoverline')" prop="toleranceValue">
          <el-input v-model="formData.toleranceValue" :placeholder="$t('warehouse.iptallowoverline')" maxlength="8" class="input-300"/>
        </el-form-item>
        <el-form-item :label="$t('warehouse.warninginventory')" prop="alarmValue">
          <el-input v-model="formData.alarmValue" :placeholder="$t('warehouse.iptwarninginventory')" maxlength="8" class="input-300"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="save()">{{ $t('common.save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { deepClone } from '../../../../utils';
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
    var checkNum = (rule, value, callback) => {
      const znum = /^(0|[1-9][0-9]*)$/;
      if (!znum.test(value)) {
        callback(new Error(this.$t('warehouse.iptrightnum')));
      } else {
        callback();
      }
    };
    return {
      dialog: false, // 弹窗标志
      title: this.$t('warehouse.editinventory'),
      formData: {
        goodsName: '',
        toleranceValue: '',
        alarmValue: ''
      },
      formRule: {
        toleranceValue: [{ required: true, validator: checkNum, trigger: 'blur' }],
        alarmValue: [{ required: true, validator: checkNum, trigger: 'blur' }]
      }
    }
  },
  watch: {
    show: {
      handler(val) {
        this.dialog = val
        if (!val) {
          this.resetForm();
        }
        if (val && this.dataSource.skuId) {
          this.formData.goodsName = this.dataSource.goodsName
          this.formData.toleranceValue = this.dataSource.toleranceValue
          this.formData.alarmValue = this.dataSource.alarmValue
        }
      }
    }
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm();
    },

    // 保存
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.$emit('handOk', this.formData);
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs['formData'].resetFields();
      this.$refs['formData'].clearValidate();
      this.formData = {
        goodsName: '',
        toleranceValue: '',
        alarmValue: ''
      }
      this.$emit('handClose', false)
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
.edit-stockNum-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 26px;
  .plan-title {
    font-size: 18px;
    color: #333333;
  }
  .distpicker {
    select {
      color: #606266;
      font-size: 12px;
      cursor: pointer;
      width: 97.5px;
      padding: 0 10px;
      padding-right: 0px;
      text-align: center;
      height: 28px;
      line-height: 26px;
      -webkit-appearance: none;
      -moz-appearance: none;
      margin-bottom: 4px;
    }
    select:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    select:focus {
      outline: none;
    }
  }
}
</style>
