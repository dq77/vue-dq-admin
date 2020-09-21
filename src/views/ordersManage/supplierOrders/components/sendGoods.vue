<!--
 * @Author: 刁琪
 * @Date: 2019-11-05 16:59:59
 * @LastEditors: 刁琪
 * @LastEditTime: 2019-11-06 15:46:42
 * @Description: file content
 -->
<template>
  <div class="supplier-send-dialog">
    <el-dialog :visible.sync="dialog" title="发货" center width="500px" @close="cancel">
      <el-form ref="formData" :model="formData" :rules="formRule" label-width="100px" status-icon>
        <el-form-item label="商品" prop="orderNo">
          <el-select v-if="dataSource.orderDetailVos" v-model="orderObj" value-key="oid" class="input-300">
            <el-option v-for="item in dataSource.orderDetailVos" :key="item.oid" :value="item" :label="item.productInfo.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司" prop="expCompany">
          <el-select v-model="formData.expCompany" placeholder="请选择发货方式" class="input-300">
            <el-option v-for="item in companyList" :key="item.expressId" :value="item.expressCode" :label="item.expressName"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.expCompany!='ZT'&&formData.expCompany!='PS'" label="物流单号" prop="expCode">
          <el-input v-model="formData.expCode" maxlength="20" placeholder="请输入物流单号" class="input-300"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="save()">{{ loading ? '发货中...' : '确认发货' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '@/api/order/order.js'
export default {
  components: {
  },
  props: {
    dataSource: {
      type: Object,
      default: function() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false, // 弹窗标志
      companyList: [],
      formData: {
        expCompany: '',
        expCode: ''
      },
      orderObj: {},
      formRule: {
        expCompany: [{ required: true, message: '请选择发货方式', trigger: 'change' }],
        expCode: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
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
        if (val && this.dataSource.orderNo) {
          this.orderObj = this.dataSource.orderDetailVos[0];
          this.getExpressCompany();
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    cancel() {
      this.resetForm()
    },
    // 获取物流公司
    getExpressCompany() {
      orderApi.expressCompany().then(res => {
        if (res.code === 200 && res.data) {
          this.companyList = res.data;
        }
      })
    },

    // 保存
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.formData.oid = this.orderObj.oid
          console.log(this.formData);
          this.$emit('handleOk', this.formData)
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$emit('handClose', false)
      this.$refs['formData'].resetFields();
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss">
  .supplier-send-dialog {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 26px;
  }
</style>
